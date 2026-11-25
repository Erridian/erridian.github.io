		function toggleChapterList(chapterListId) {
			var chapterList = document.getElementById(chapterListId);
			if (chapterList.style.display === 'none') {
				chapterList.style.display = 'block';
			} else {
				chapterList.style.display = 'none';
			}
		}