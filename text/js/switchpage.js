		function togglePage(pageId) {
			document.querySelectorAll('.page').forEach(function(page) {
				page.classList.add('hidden');
			});
			document.querySelector(`#${pageId}`).classList.remove('hidden');
		}