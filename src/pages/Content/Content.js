import StorageHelper from '../Popup/helpers/storage.helper';

class Content {
  constructor() {
    this.textInputs = document.querySelectorAll('input:not([type="hidden"])');
    this.textareaEls = document.querySelectorAll('form textarea');
    this.inputs = [...this.textInputs, ...this.textareaEls];

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.connectAndSyncWithStorage = this.connectAndSyncWithStorage.bind(this);
    this.listenContextMenu = this.listenContextMenu.bind(this);
    this.listenFormData = this.listenFormData.bind(this);

    this.categories = ['information', 'idea', 'personal', 'history'];
    this.data = {
      personal: '',
      collected: '',
    };

    this.isWebSiteDisabled = false;
  }

  findPos(node) {
    let curtop = 0;
    let curtopscroll = 0;

    if (node.offsetParent) {
      do {
        curtop += node.offsetTop;
        curtopscroll += node.offsetParent ? node.offsetParent.scrollTop : 0;
      } while ((node = node.offsetParent));

      return curtop - curtopscroll;
    }
  }

  getStorageData(key, arr) {
    if (key === 'disabledList') {
      arr &&
        arr.forEach &&
        arr.forEach((item) => {
          const isExist = item.url === window.location.href;

          if (isExist) this.isWebSiteDisabled = item.status;

          return;
        });

      return;
    }

    if (arr) {
      let string = '';

      arr.forEach((item) => {
        const result = `Q: ${item.question} A: ${item.answer} `;
        string += result;
      });

      this.data[key] = string;
    }
  }

  connectAndSyncWithStorage() {
    try {
      ['personal', 'collected', 'disabledList'].forEach((key) => {
        StorageHelper.get({
          key,
          callback: this.getStorageData.bind(this, key),
        });
      });
    } catch (err) {
      console.error(err);
    }
  }

  removeLoadingStyleFromCurrentInput(input) {
    const id = input.id || input.name;
    const loadingEl = document.querySelector(
      `.jaf-extension-loading[input-id="${id}"]`
    );

    if (loadingEl) {
      loadingEl.remove();
    }

    input.classList.remove('jaf-extension-focus');

    if (input.parentNode.querySelector('.jaf-extension-button'))
      input.parentNode
        .querySelector('.jaf-extension-button')
        .classList.remove('has-loading');
  }

  fillElements({ input, answer }) {
    debugger;
    const funcs = {
      TEXTAREA: () => (input.innerText = answer),
      INPUT: () => input.setAttribute('value', answer),
    };

    funcs[input.nodeName] && funcs[input.nodeName]();

    this.removeLoadingStyleFromCurrentInput(input);
  }

  getInputType(text) {
    try {
      let score = 0;
      let result;
      text.forEach((item, index) => {
        if (item.score > score) {
          score = item.score;
          result = index;
        }
      });

      const inputType = this.categories[result];
      return inputType;
    } catch (err) {
      console.error(err);
    }
  }

  handleButtonClick({ input, label }, { target: buttonEl }) {
    try {
      if (buttonEl) buttonEl.classList.add('has-loading');

      if (
        input &&
        input.getAttribute('class').indexOf('jaf-extension-focus') < 0
      )
        input.classList.add('jaf-extension-focus');

      chrome.runtime.sendMessage(
        { type: 'CATEGORIZE_DATA', query: label.innerText },
        (response) => {
          const inputType = this.getInputType(response.data.data);
          console.log('@INPUT_TYPE: ', inputType);

          if (['personal', 'information', 'history'].includes(inputType)) {
            chrome.runtime.sendMessage(
              {
                type: 'COMPLETION',
                prompt: `${this.data.personal} Q: ${label.innerText}?`,
              },
              (response) => {
                console.log('response', response);
                const answer = response.data.data.choices[0].text;

                this.fillElements({ input, answer: answer.split('A:')[1] });
              }
            );
          }

          if (['idea'].includes(inputType)) {
            chrome.runtime.sendMessage(
              {
                type: 'GENERATE_DATA',
                context: `${this.data.personal} Q: ${label.innerText}? A: `,
              },
              (response) => {
                const textArr = response.data.data.data[0].text
                  .join('')
                  .split('A:');

                const answer = textArr[textArr.length - 1];
                this.fillElements({ input, answer });
              }
            );
          }
        }
      );
    } catch (err) {
      this.removeLoadingStyleFromCurrentInput(input);
      console.error(err);
    }
  }

  removeAllButtons() {
    document.querySelectorAll('.jaf-extension-button').forEach((button) => {
      if (button && button.remove) button.remove();
    });
  }

  createExtensionLogo({ top, left, width, height, input, label }) {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'jaf-extension-button');
    button.innerHTML = `
      <img
        src="https://www.jotform.com/wepay/assets/img/podo.png?v=1.0.0.0"
        alt="podo-logo-jf-auto-fill-extension"
      />
      <div class="jaf-extension-button-loader">
        <div class="jaf-extension-button-loader__blob"></div>
        <div class="jaf-extension-button-loader__blob"></div>
        <div class="jaf-extension-button-loader__blob"></div>
      </div>
    `;

    button.addEventListener(
      'click',
      this.handleButtonClick.bind(this, { input, label })
    );
    // button.setAttribute(
    //   'style',
    //   `
    //   top: ${height / 2}px;
    // `
    // );

    return button;
  }

  render({ showIcon }) {
    console.log('showIcon', showIcon);
    if (!showIcon) {
      this.removeAllButtons();
      return;
    }

    this.inputs.forEach((input) => {
      window.scrollTo(0, 0);

      if (
        input.nodeName === 'INPUT' &&
        ['file', 'tel'].includes(input.getAttribute('type'))
      )
        return;

      const { id: inputId } = input;
      let i = 0;
      let parentEl = input;
      let targetLabel;

      while (i < 10) {
        const el =
          parentEl.parentNode.querySelector('label') ||
          parentEl.parentNode.querySelector('div[role="heading"]');

        if (el) {
          targetLabel = el;
          i = 10;
        }

        parentEl = parentEl.parentNode;
        i++;
      }

      const label =
        document.querySelector(`label[for="${inputId}"]`) || targetLabel;
      // if the target input has the label with same id
      if (!label) return;

      const { top, left, width, height } = input.getBoundingClientRect();

      const button = this.createExtensionLogo({
        top,
        left,
        width,
        height,
        input,
        label,
      });

      const parentNodeStyle = input.parentNode.getAttribute('style');
      const hasDisplay =
        typeof parentNodeStyle === 'string'
          ? parentNodeStyle.indexOf('display:') > -1
          : false;
      const hasNone =
        typeof parentNodeStyle === 'string'
          ? parentNodeStyle.indexOf('none') > -1
          : false;
      const hasDisplayNone = hasDisplay && hasNone;

      if (!hasDisplayNone)
        input.parentNode.style = 'position: relative; display: block';
      input.parentNode.appendChild(button);
    });
  }

  closeCollectDataQuestion(data) {
    document.querySelector('.jaf-question-collect').remove();
  }

  handleCollectDataQuestion(data) {
    StorageHelper.save({ key: 'collected', data });

    document.querySelector('.jaf-question-collect').remove();
  }

  createCollectDataQuestion(data) {
    const div = document.createElement('div');
    div.setAttribute('class', 'jaf-question-collect');
    div.innerHTML = `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper mollis augue, ut gravida justo mollis at. Aenean maximus quam quis tempus pharetra. Pellentesque dapibus metus vel porttitor semper.</p>
      <button id="close">Close</button>
      <button id="save">Save</button>
    `;
    div
      .querySelector('button#save')
      .addEventListener(
        'click',
        this.handleCollectDataQuestion.bind(this, data)
      );

    div
      .querySelector('button#close')
      .addEventListener('click', this.closeCollectDataQuestion);

    document.body.appendChild(div);
  }

  autoFill() {
    this.inputs.forEach((input, index) => {
      input.classList.add('jaf-extension-transition');

      setTimeout(() => {
        if (this.inputs[index - 1]) {
          this.inputs[index - 1].classList.remove('jaf-extension-box-shadow');
          this.inputs[index - 1].classList.remove('jaf-extension-transition');
          this.fillElements({ input: this.inputs[index - 1], answer: 'Test' });
        }

        input.classList.add('jaf-extension-box-shadow');
      }, index * 1000);
    });
  }

  createProgressSection() {
    const div = document.createElement('div');
    div.setAttribute('class', 'jaf-extension-progress');

    div.innerHTML = `
      <div class="jaf-extension-progress-message">
        <img src="https://www.jotform.com/wepay/assets/img/podo.png?v=1.0.0.0" alt="jotform-podo" />
        <h4>Form is filling by JotForm AI</h4>
        <div class="jaf-extension-progress-bar-wrapper">
          <div class="jaf-extension-progress-bar"></div>
        </div>
      </div>
    `;

    document.body.appendChild(div);
  }

  listenContextMenu() {
    let label = null;
    let input = null;

    document.addEventListener(
      'contextmenu',
      (event) => {
        let i = 0;
        input = event.target;
        let parentEl = event.target;
        let targetLabel;

        while (i < 10) {
          const el =
            parentEl.parentNode.querySelector('label') ||
            parentEl.parentNode.querySelector('div[role="heading"]');

          if (el) {
            targetLabel = el;
            i = 10;
          }

          parentEl = parentEl.parentNode;
          i++;
        }

        label =
          document.querySelector(`label[for="${input.id}"]`) || targetLabel;
      },
      true
    );

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === 'fillAllForm') {
        this.createProgressSection();
        this.autoFill();

        sendResponse({
          msg: 'handleButtonClick started!',
        });
      }

      if (request.type === 'getClickedEl') {
        this.createLoading(input);
        this.handleButtonClick({ input, label }, { target: null });

        sendResponse({
          msg: 'handleButtonClick started!',
        });
      }
    });
  }

  listenFormData() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === 'getFormData') {
        const { data } = request;
        this.createCollectDataQuestion(data);

        sendResponse({
          msg: 'listenFormData started!',
        });
      }
    });
  }

  createLoading(input) {
    const { left, height, width } = input.getBoundingClientRect();
    const top = this.findPos(input);
    input.classList.add('jaf-extension-focus');

    const div = document.createElement('div');
    div.setAttribute('input-id', input.id || input.name);
    div.setAttribute('class', 'jaf-extension-loading');
    div.setAttribute(
      'style',
      `
        top: ${top + +height / 2}px;
        left: ${left + width}px;
      `
    );
    div.innerHTML = `
      <div class="jaf-extension-button-loader">
        <div class="jaf-extension-button-loader__blob"></div>
        <div class="jaf-extension-button-loader__blob"></div>
        <div class="jaf-extension-button-loader__blob"></div>
      </div>
    `;

    document.body.appendChild(div);
  }

  init({ showIcon }) {
    console.log('showIcon@init', showIcon);
    this.render({ showIcon });
    this.connectAndSyncWithStorage();
  }
}

export default new Content();
