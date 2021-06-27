class OptionsViewModel {
    constructor(props) {
        // 自己是不是打开
        this.isOpen = false;
        this.map = props;
        // 打开的唯一
        this.onlyOpenIndex = null
    }

    select(index) {
        this.onlyOpenIndex = index;
        return this;
    }

    open() {
        this.isOpen = true;
        return this;
    }

    closeAllForms() {
        this.onlyOpenIndex = null;
        return this;
    }

    toggleOpen() {
        this.isOpen = !this.isOpen;
        return this;
    }
}

export default OptionsViewModel;
