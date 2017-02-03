class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        try {
            if (config == undefined) {
                throw new Error("Config isn\'t passed");
            }
            this._conf = config;
            this._conf.initial = config.initial;
            this.history = [config.initial];
            this.histPos = 0;
        } catch (e) {
            e.message();
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this._conf.initial;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        try {
            var isStateExist = false;
            for (var prop in this._conf.states) {
                if (prop == state) {
                    isStateExist = true;
                }
            }
            if (isStateExist == false) {
                throw new Error('State does not exist');
            }

            this._conf.initial = state;
            this.history[this.history.length] = state;
            this.histPos = this.history.length - 1;
        } catch (e) {
            e.message();
        }

    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        for (var prop in this._conf.states) {
            if (prop >= this._conf.initial) {
                for (var trans in this._conf.states[prop].transitions) {
                    if (event == trans) {
                      this._conf.initial = this._conf.states[prop].transitions[trans];
                      this.history[this.history.length] = this._conf.states[prop].transitions[trans];
                      this.histPos = this.history.length - 1;
                        return;
                    }
                }
            }
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this._conf.initial = this.history[0];
        this.history[this.history.length] = this.history[0];
        this.histPos = this.history.length - 1;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        var arr = [];
        var i = 0;
        if (event == undefined) {
            for (var prop in this._conf.states) {
                arr[i] = prop;
                i++;
            }
        }
        for (var prop in this._conf.states) {
            for (var trans in this._conf.states[prop].transitions) {
                if (event == trans) {
                    arr[i] = prop;
                    i++;
                }
            }
        }
        return arr;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.histPos == 0) {
            return false;
        }
        this.histPos--;
        this._conf.initial = this.history[this.histPos];

        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.histPos == this.history.length - 1) {
            return false;
        }
        this.histPos++;
        this._conf.initial = this.history[this.histPos];

        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = null;
        this.histPos = 0;
        this.history = [this._conf.initial];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
