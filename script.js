class Tabbed {
	constructor(tabbed) {
		this.tabbed = tabbed;
		this.tablist = tabbed.querySelector('[data-type=tablist]');
		this.tabs = [...tabbed.querySelectorAll('[data-type=tab]')];
		this.panels = [...tabbed.querySelectorAll('[data-type=tabpanel]')];
	}

	initTabbed = () => {
		this.initTabs();
		this.initTablist();
		this.initPanels();
	};

	initTabs = () => {
		this.tabs.forEach((tab, tabIndex) => {
			tab.setAttribute('role', 'tab');
			tab.setAttribute('id', `tab${tabIndex + 1}`);
			tab.setAttribute('tabindex', '-1');
			const parent = tab.closest('[data-type="tab-parent"]');
			parent.setAttribute('role', 'presentation');

			this.tabAddClickHandler(tab);
			this.tabAddKeydownHandler(tab, tabIndex);
		});

		this.tabs[0].removeAttribute('tabindex');
		this.tabs[0].setAttribute('aria-selected', 'true');
	};

	initTablist = () => {
		this.tablist.setAttribute('role', 'tablist');
	};

	initPanels = () => {
		this.panels.forEach((panel, panelIndex) => {
			panel.setAttribute('role', 'tabpanel');
			panel.setAttribute('tabindex', '-1');
			panel.setAttribute('aria-labelledby', this.tabs[panelIndex].id);
			panel.hidden = true;
		});
		this.panels[0].hidden = false;
	};

	tabAddClickHandler = (tab) => {
		tab.addEventListener('click', (event) => {
			event.preventDefault();
			const currentTab = this.tablist.querySelector('[aria-selected]');
			if (event.currentTarget !== currentTab) {
				this.switchTab(currentTab, event.currentTarget);
			}
		});
	};

	tabAddKeydownHandler = (tab, tabIndex) => {
		tab.addEventListener('keydown', (event) => {
			const currentIndex = this.tabs.indexOf(event.currentTarget);

			const direction = this.getDirection(event, currentIndex);

			if (direction !== null) {
				event.preventDefault();
				if (direction === 'down') {
					this.panels[tabIndex].focus();
				} else if (this.tabs[direction]) {
					this.switchTab(event.currentTarget, this.tabs[direction]);
				}
			}
		});
	};

	getDirection = (event, currentIndex) => {
		return event.key === 'ArrowLeft'
			? currentIndex - 1
			: event.key === 'ArrowRight'
			? currentIndex + 1
			: event.key === 'ArrowDown'
			? 'down'
			: null;
	};

	switchTab = (oldTab, newTab) => {
		newTab.focus();
		newTab.removeAttribute('tabindex');
		newTab.setAttribute('aria-selected', 'true');

		oldTab.removeAttribute('aria-selected');
		oldTab.setAttribute('tabindex', '-1');
		const newIndex = this.tabs.indexOf(newTab);
		const oldIndex = this.tabs.indexOf(oldTab);

		this.panels[oldIndex].hidden = true;
		this.panels[newIndex].hidden = false;
	};
}

const tabbedList = document.querySelectorAll('[data-type=tabbed]');
tabbedList.forEach(($tabbed) => {
	const tabbed = new Tabbed($tabbed);
	tabbed.initTabbed();
});
