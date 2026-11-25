#!/usr/bin/env python3
"""
GUI-редактор Markdown-постов для Erridian Mail на PySide6.
Поддерживает создание/редактирование .md файлов с YAML Frontmatter,
автоматическое копирование картинок в posts/images/ (для обложки и текста),
живой предпросмотр Markdown и обновление posts/index.json.
"""

import datetime
import re
import shutil
import subprocess
import sys
from pathlib import Path

from PySide6.QtCore import QDate, Qt
from PySide6.QtGui import QFont, QPixmap
from PySide6.QtWidgets import (
    QApplication,
    QCheckBox,
    QComboBox,
    QDateEdit,
    QFileDialog,
    QFormLayout,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QListWidget,
    QMainWindow,
    QMessageBox,
    QPlainTextEdit,
    QPushButton,
    QSplitter,
    QTabWidget,
    QTextBrowser,
    QVBoxLayout,
    QWidget,
)

ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = ROOT / "posts"
IMAGES_DIR = POSTS_DIR / "images"

sys.path.insert(0, str(Path(__file__).resolve().parent))
import update_posts  # noqa: E402

CATEGORIES = ["diary", "anime", "manga", "games", "music", "tech"]
IMAGE_FILTER = "Изображения (*.png *.jpg *.jpeg *.webp *.gif);;Все файлы (*.*)"

TRANSLIT_MAP = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo",
    "ж": "zh", "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m",
    "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
    "ф": "f", "х": "h", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "sch",
    "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya",
}


def slugify(text: str) -> str:
    res = []
    for ch in text.lower():
        if ch in TRANSLIT_MAP:
            res.append(TRANSLIT_MAP[ch])
        elif ch.isalnum():
            res.append(ch)
        elif ch in (" ", "-", "_"):
            res.append("-")
    slug = re.sub(r"-+", "-", "".join(res)).strip("-")
    return slug or f"post-{datetime.date.today().isoformat()}"


def import_image_to_repo(src_path: Path) -> str:
    """Копирует выбранную картинку в posts/images/ (если ещё не в репозитории) и возвращает относительный путь."""
    src_resolved = src_path.resolve()
    try:
        rel = src_resolved.relative_to(ROOT.resolve())
        return rel.as_posix()
    except ValueError:
        pass

    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    safe_name = re.sub(r"[^a-zA-Z0-9._-]", "_", src_path.name)
    dest = IMAGES_DIR / safe_name

    # Если файл с таким именем уже есть, но это другая картинка — добавим суффикс
    if dest.exists() and dest.stat().st_size != src_path.stat().st_size:
        stem = Path(safe_name).stem
        suffix = Path(safe_name).suffix
        stamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        dest = IMAGES_DIR / f"{stem}_{stamp}{suffix}"

    shutil.copy2(src_path, dest)
    return dest.relative_to(ROOT).as_posix()


class PostEditorWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Erridian Mail — Редактор постов (PySide6)")
        self.resize(1120, 740)

        self.current_file: Path | None = None
        self.post_files: list[Path] = []

        self._build_ui()
        self.refresh_file_list()
        self.new_post()

    def _build_ui(self):
        central = QWidget()
        self.setCentralWidget(central)
        main_layout = QHBoxLayout(central)

        splitter = QSplitter(Qt.Horizontal)
        main_layout.addWidget(splitter)

        # --- Левая панель: список постов ---
        left_widget = QWidget()
        left_layout = QVBoxLayout(left_widget)
        left_layout.setContentsMargins(4, 4, 4, 4)

        lbl_list = QLabel("Посты в posts/")
        lbl_list.setStyleSheet("font-weight: bold; font-size: 13px;")
        left_layout.addWidget(lbl_list)

        self.list_posts = QListWidget()
        self.list_posts.currentRowChanged.connect(self.on_select_post)
        left_layout.addWidget(self.list_posts)

        btn_new = QPushButton("+ Новый пост")
        btn_new.clicked.connect(self.new_post)
        left_layout.addWidget(btn_new)

        btn_reindex = QPushButton("Обновить index.json")
        btn_reindex.clicked.connect(self.run_reindex)
        left_layout.addWidget(btn_reindex)

        splitter.addWidget(left_widget)

        # --- Правая панель: форма + редактор + превью ---
        right_widget = QWidget()
        right_layout = QVBoxLayout(right_widget)
        right_layout.setContentsMargins(6, 4, 4, 4)

        # Верхняя часть формы + мини-превью обложки
        top_row = QHBoxLayout()
        form = QFormLayout()
        form.setLabelAlignment(Qt.AlignRight)

        self.ed_title = QLineEdit()
        self.ed_title.setPlaceholderText("Например: Обзор на Steins;Gate")
        form.addRow("Заголовок:", self.ed_title)

        slug_row = QHBoxLayout()
        self.ed_slug = QLineEdit()
        self.ed_slug.setPlaceholderText("steins-gate-review")
        btn_auto_slug = QPushButton("Авто")
        btn_auto_slug.setFixedWidth(60)
        btn_auto_slug.clicked.connect(self.auto_slug)
        slug_row.addWidget(self.ed_slug)
        slug_row.addWidget(btn_auto_slug)
        form.addRow("Slug (файл):", slug_row)

        meta_row1 = QHBoxLayout()
        self.ed_date = QDateEdit()
        self.ed_date.setDisplayFormat("yyyy-MM-dd")
        self.ed_date.setCalendarPopup(True)
        self.ed_date.setDate(QDate.currentDate())
        self.cb_category = QComboBox()
        self.cb_category.addItems(CATEGORIES)
        meta_row1.addWidget(self.ed_date)
        meta_row1.addWidget(QLabel("Категория:"))
        meta_row1.addWidget(self.cb_category)
        form.addRow("Дата:", meta_row1)

        self.ed_tags = QLineEdit()
        self.ed_tags.setPlaceholderText("аниме, обзор, sci-fi")
        form.addRow("Теги:", self.ed_tags)

        meta_row2 = QHBoxLayout()
        self.ed_rating = QLineEdit()
        self.ed_rating.setPlaceholderText("9/10")
        self.ed_status = QLineEdit()
        self.ed_status.setPlaceholderText("Просмотрено / Пройдено")
        meta_row2.addWidget(self.ed_rating)
        meta_row2.addWidget(QLabel("Статус:"))
        meta_row2.addWidget(self.ed_status)
        form.addRow("Оценка:", meta_row2)

        cover_row = QHBoxLayout()
        self.ed_cover = QLineEdit()
        self.ed_cover.setPlaceholderText("posts/images/cover.jpg или URL")
        self.ed_cover.textChanged.connect(self.update_cover_preview)
        btn_pick_cover = QPushButton("🖼️ Выбрать обложку...")
        btn_pick_cover.clicked.connect(self.pick_cover_image)
        btn_clear_cover = QPushButton("✕")
        btn_clear_cover.setFixedWidth(28)
        btn_clear_cover.clicked.connect(lambda: self.ed_cover.clear())
        cover_row.addWidget(self.ed_cover)
        cover_row.addWidget(btn_pick_cover)
        cover_row.addWidget(btn_clear_cover)
        form.addRow("Обложка:", cover_row)

        self.ed_excerpt = QLineEdit()
        self.ed_excerpt.setPlaceholderText("Краткое описание для списка писем и окна Что нового")
        form.addRow("Описание:", self.ed_excerpt)

        self.chk_publish = QCheckBox("Опубликовать на сайте (publish: true)")
        self.chk_publish.setChecked(True)
        form.addRow("", self.chk_publish)

        top_row.addLayout(form, stretch=1)

        # Превью обложки справа от формы
        self.lbl_cover_preview = QLabel("Нет\nобложки")
        self.lbl_cover_preview.setFixedSize(140, 190)
        self.lbl_cover_preview.setAlignment(Qt.AlignCenter)
        self.lbl_cover_preview.setStyleSheet(
            "border: 1px solid #666; background: #1e1e1e; color: #888; border-radius: 4px;"
        )
        top_row.addWidget(self.lbl_cover_preview)

        right_layout.addLayout(top_row)

        # Панель инструментов над редактором
        editor_tools = QHBoxLayout()
        btn_insert_img = QPushButton("🖼️ Вставить картинку в текст")
        btn_insert_img.clicked.connect(self.insert_image_into_body)
        btn_insert_h2 = QPushButton("H2")
        btn_insert_h2.setFixedWidth(40)
        btn_insert_h2.clicked.connect(lambda: self.insert_snippet("## Подзаголовок\n"))
        btn_insert_quote = QPushButton("Цитата")
        btn_insert_quote.setFixedWidth(70)
        btn_insert_quote.clicked.connect(lambda: self.insert_snippet("> Цитата\n"))
        btn_insert_code = QPushButton("Код")
        btn_insert_code.setFixedWidth(50)
        btn_insert_code.clicked.connect(lambda: self.insert_snippet("```text\nкод\n```\n"))

        editor_tools.addWidget(btn_insert_img)
        editor_tools.addWidget(btn_insert_h2)
        editor_tools.addWidget(btn_insert_quote)
        editor_tools.addWidget(btn_insert_code)
        editor_tools.addStretch()
        right_layout.addLayout(editor_tools)

        # Вкладки: Редактор Markdown / Живой предпросмотр
        self.tabs = QTabWidget()
        self.txt_body = QPlainTextEdit()
        self.txt_body.setFont(QFont("Consolas", 11))
        self.txt_body.setPlaceholderText("Пиши здесь текст поста в Markdown...")

        self.preview_browser = QTextBrowser()
        self.preview_browser.setOpenExternalLinks(True)
        self.preview_browser.setSearchPaths([str(ROOT), str(POSTS_DIR)])

        self.tabs.addTab(self.txt_body, "✏️ Markdown")
        self.tabs.addTab(self.preview_browser, "👁️ Предпросмотр")
        self.tabs.currentChanged.connect(self.on_tab_changed)
        right_layout.addWidget(self.tabs, stretch=1)

        # Нижняя панель кнопок
        bottom_bar = QHBoxLayout()
        btn_save = QPushButton("💾 Сохранить пост и обновить index.json")
        btn_save.setMinimumHeight(34)
        btn_save.clicked.connect(self.save_post)

        btn_push = QPushButton("🚀 Git Commit & Push")
        btn_push.setMinimumHeight(34)
        btn_push.clicked.connect(self.git_push)

        bottom_bar.addWidget(btn_save)
        bottom_bar.addStretch()
        bottom_bar.addWidget(btn_push)
        right_layout.addLayout(bottom_bar)

        splitter.addWidget(right_widget)
        splitter.setSizes([240, 860])

    def auto_slug(self):
        title = self.ed_title.text().strip()
        if title:
            self.ed_slug.setText(slugify(title))

    def refresh_file_list(self):
        self.list_posts.blockSignals(True)
        self.list_posts.clear()
        self.post_files = [
            p for p in sorted(POSTS_DIR.glob("*.md"))
            if not p.name.startswith("_") and p.name not in update_posts.IGNORE_FILES
        ]
        for p in self.post_files:
            self.list_posts.addItem(p.name)
        self.list_posts.blockSignals(False)

    def new_post(self):
        self.current_file = None
        self.list_posts.clearSelection()
        self.ed_title.clear()
        self.ed_slug.clear()
        self.ed_date.setDate(QDate.currentDate())
        self.cb_category.setCurrentText("diary")
        self.ed_tags.clear()
        self.ed_rating.clear()
        self.ed_status.clear()
        self.ed_cover.clear()
        self.ed_excerpt.clear()
        self.chk_publish.setChecked(True)
        self.txt_body.setPlainText("# Заголовок\n\nТекст заметки...\n")
        self.tabs.setCurrentIndex(0)

    def on_select_post(self, row: int):
        if row < 0 or row >= len(self.post_files):
            return
        path = self.post_files[row]
        self.current_file = path
        content = path.read_text(encoding="utf-8")
        meta, body = update_posts.parse_frontmatter(content)

        self.ed_title.setText(str(meta.get("title", "")))
        self.ed_slug.setText(str(meta.get("slug", path.stem)))

        date_str = str(meta.get("date", datetime.date.today().isoformat()))[:10]
        qdate = QDate.fromString(date_str, "yyyy-MM-dd")
        self.ed_date.setDate(qdate if qdate.isValid() else QDate.currentDate())

        cat = str(meta.get("category", "diary"))
        self.cb_category.setCurrentText(cat if cat in CATEGORIES else "diary")

        tags = meta.get("tags", [])
        self.ed_tags.setText(", ".join(tags) if isinstance(tags, list) else str(tags))
        self.ed_rating.setText(str(meta.get("rating", "")))
        self.ed_status.setText(str(meta.get("status", "")))
        self.ed_cover.setText(str(meta.get("cover", "")))
        self.ed_excerpt.setText(str(meta.get("excerpt", "")))
        self.chk_publish.setChecked(meta.get("publish", True) is not False)

        self.txt_body.setPlainText(body.lstrip("\r\n"))
        if self.tabs.currentIndex() == 1:
            self.update_preview()

    def update_cover_preview(self, cover_val: str):
        val = cover_val.strip()
        if not val:
            self.lbl_cover_preview.setPixmap(QPixmap())
            self.lbl_cover_preview.setText("Нет\nобложки")
            return
        local_path = ROOT / val
        if local_path.exists() and local_path.is_file():
            pix = QPixmap(str(local_path))
            if not pix.isNull():
                scaled = pix.scaled(
                    self.lbl_cover_preview.size(), Qt.KeepAspectRatio, Qt.SmoothTransformation
                )
                self.lbl_cover_preview.setPixmap(scaled)
                return
        self.lbl_cover_preview.setPixmap(QPixmap())
        self.lbl_cover_preview.setText("URL / не найден\nлокально")

    def pick_cover_image(self):
        file_path, _ = QFileDialog.getOpenFileName(self, "Выбрать обложку", str(ROOT), IMAGE_FILTER)
        if not file_path:
            return
        rel = import_image_to_repo(Path(file_path))
        self.ed_cover.setText(rel)

    def insert_image_into_body(self):
        file_path, _ = QFileDialog.getOpenFileName(self, "Выбрать картинку для вставки", str(ROOT), IMAGE_FILTER)
        if not file_path:
            return
        src = Path(file_path)
        rel = import_image_to_repo(src)
        snippet = f"\n![{src.stem}]({rel})\n"
        self.tabs.setCurrentIndex(0)
        self.txt_body.insertPlainText(snippet)
        self.txt_body.setFocus()

    def insert_snippet(self, text: str):
        self.tabs.setCurrentIndex(0)
        self.txt_body.insertPlainText(text)
        self.txt_body.setFocus()

    def on_tab_changed(self, idx: int):
        if idx == 1:
            self.update_preview()

    def update_preview(self):
        self.preview_browser.setMarkdown(self.txt_body.toPlainText())

    def save_post(self):
        title = self.ed_title.text().strip()
        if not title:
            QMessageBox.warning(self, "Ошибка", "Укажи заголовок поста!")
            return

        slug = self.ed_slug.text().strip() or slugify(title)
        slug = re.sub(r"[^a-zA-Z0-9_-]", "-", slug).strip("-")
        self.ed_slug.setText(slug)

        target = POSTS_DIR / f"{slug}.md"
        tags_list = [t.strip() for t in self.ed_tags.text().split(",") if t.strip()]

        lines = [
            "---",
            f'title: "{title.replace(chr(34), chr(39))}"',
            f"date: {self.ed_date.date().toString('yyyy-MM-dd')}",
            f"category: {self.cb_category.currentText()}",
        ]
        if tags_list:
            lines.append("tags:")
            for t in tags_list:
                lines.append(f"  - {t}")
        else:
            lines.append("tags: []")

        if self.ed_rating.text().strip():
            lines.append(f'rating: "{self.ed_rating.text().strip()}"')
        if self.ed_status.text().strip():
            lines.append(f'status: "{self.ed_status.text().strip()}"')
        if self.ed_cover.text().strip():
            lines.append(f'cover: "{self.ed_cover.text().strip()}"')
        if self.ed_excerpt.text().strip():
            lines.append(f'excerpt: "{self.ed_excerpt.text().strip().replace(chr(34), chr(39))}"')

        lines.append(f"publish: {'true' if self.chk_publish.isChecked() else 'false'}")
        lines.append("---")
        lines.append("")

        body = self.txt_body.toPlainText().rstrip() + "\n"
        target.write_text("\n".join(lines) + body, encoding="utf-8")

        self.current_file = target
        update_posts.main()
        self.refresh_file_list()
        QMessageBox.information(self, "Готово!", f"Пост сохранён:\n{target.name}\n\nposts/index.json обновлён!")

    def run_reindex(self):
        update_posts.main()
        self.refresh_file_list()
        QMessageBox.information(self, "Готово!", "posts/index.json успешно пересобран.")

    def git_push(self):
        if not (ROOT / ".git").exists():
            QMessageBox.warning(
                self,
                "Git не настроен",
                "Эта папка не является Git-репозиторием (отсутствует папка .git).\n\n"
                "Чтобы кнопка Push работала:\n"
                "1. Склонируй репозиторий через `git clone https://github.com/Erridian/erridian.github.io.git` (или через GitHub Desktop),\n"
                "2. Либо загрузи обновлённую папку `posts/` на GitHub вручную."
            )
            return

        try:
            subprocess.run(["git", "add", "posts/"], cwd=ROOT, check=True)
            status = subprocess.run(["git", "status", "--porcelain", "posts/"], cwd=ROOT, capture_output=True, text=True)
            if status.stdout.strip():
                subprocess.run(["git", "commit", "-m", "chore: update blog posts and images"], cwd=ROOT, check=True)

            # Проверяем, настроен ли upstream у текущей ветки
            upstream = subprocess.run(
                ["git", "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )
            if upstream.returncode != 0:
                branch = subprocess.run(
                    ["git", "rev-parse", "--abbrev-ref", "HEAD"],
                    cwd=ROOT,
                    capture_output=True,
                    text=True,
                    check=True,
                ).stdout.strip()
                res = subprocess.run(["git", "push", "-u", "origin", branch], cwd=ROOT, capture_output=True, text=True)
            else:
                res = subprocess.run(["git", "push"], cwd=ROOT, capture_output=True, text=True)

            if res.returncode != 0:
                QMessageBox.critical(self, "Ошибка Git Push", f"Git вернул ошибку:\n\n{res.stderr.strip() or res.stdout.strip()}")
                return

            QMessageBox.information(self, "Git", "Посты и картинки успешно отправлены на GitHub!")
        except subprocess.CalledProcessError as exc:
            QMessageBox.critical(self, "Ошибка Git", f"Не удалось выполнить операцию Git:\n{exc}")


def main():
    app = QApplication(sys.argv)
    app.setStyle("Fusion")
    win = PostEditorWindow()
    win.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
