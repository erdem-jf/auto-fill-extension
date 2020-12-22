import StorageHelper from '../Popup/helpers/storage.helper';

class Content {
  constructor() {
    this.textInputs = document.querySelectorAll('input:not([type="hidden"])');
    this.textareaEls = document.querySelectorAll('textarea');
    // this.contentEditableEls = document.querySelectorAll(
    //   'div[contenteditable="true"]'
    // );
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

  getStorageData(key, arr) {
    if (key === 'disabledList') {
      arr.forEach((item) => {
        const isExist = item.url === window.location.href;

        if (isExist) this.isWebSiteDisabled = item.status;

        return;
      });

      console.log('@@@@@', this.isWebSiteDisabled);

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

  fillElements({ input, answer }) {
    const funcs = {
      textarea: () => (input.innerText = answer),
      text: () => input.setAttribute('value', answer),
    };

    funcs[input.type] && funcs[input.type]();
  }

  async handleButtonClick({ input, label }, { target: buttonEl }) {
    console.log('innerText', label.innerText);
    if (buttonEl) {
      buttonEl.disabled = true;
      buttonEl.classList.add('has-loading');
    }

    const removeLoadingFromCurrentButton = () => {
      if (buttonEl) {
        buttonEl.disabled = false;
        buttonEl.classList.remove('has-loading');
      }

      if (label.getAttribute('role') === 'heading') {
        input.nextElementSibling.style.display = 'none';
      }

      if (document.querySelector('.jaf-extension-loading'))
        document.querySelector('.jaf-extension-loading').remove();
    };

    try {
      chrome.runtime.sendMessage(
        { type: 'CATEGORIZE_DATA', query: label.innerText },
        (response) => {
          let score = 0;
          let result;
          response.data.data.forEach((item, index) => {
            if (item.score > score) {
              score = item.score;
              result = index;
            }
          });

          const inputType = this.categories[result];
          console.log('inputType', inputType);

          if (['personal', 'information', 'history'].includes(inputType)) {
            chrome.runtime.sendMessage(
              {
                type: 'COMPLETION',
                prompt: `${
                  ['information', 'personal'].includes(inputType)
                    ? this.data.personal
                    : ''
                }Q: ${label.innerText}?`,
              },
              (response) => {
                const answer = response.data.data.choices[0].text;
                console.log('input', input.nodeName);
                this.fillElements({ input, answer: answer.split('A:')[1] });
                removeLoadingFromCurrentButton();
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
                console.log('input', input.nodeName);
                this.fillElements({ input, answer });
                removeLoadingFromCurrentButton();
              }
            );
          }
        }
      );
    } catch (err) {
      removeLoadingFromCurrentButton();
      console.error(err);
    }
  }

  createExtensionLogo({ top, left, width, height, input, label }) {
    const button = document.createElement('button');
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
    button.setAttribute(
      'style',
      `
      top: ${top + height / 2}px;
      left: ${left + width - 4}px;
    `
    );

    return button;
  }

  removeAllButtons() {
    document.querySelectorAll('.jaf-extension-button').forEach((button) => {
      if (button && button.remove) button.remove();
    });
  }

  render({ showIcon }) {
    if (!showIcon) {
      this.removeAllButtons();
      return;
    }

    this.inputs.forEach((input) => {
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
      if (!label && input.nodeName !== 'DIV') return;

      const { top, left, width, height } = input.getBoundingClientRect();
      this.button = this.createExtensionLogo({
        top,
        left,
        width,
        height,
        input,
        label: input.nodeName !== 'DIV' ? label : input,
      });

      document.querySelector('body').appendChild(this.button);
    });
  }

  resizeObserver() {
    const resizeObserver = new ResizeObserver(() => {
      document
        .querySelectorAll('.jaf-extension-button')
        .forEach((item, index) => {
          const { left, top, width, height } = this.inputs[
            index
          ].getBoundingClientRect();

          item.setAttribute(
            'style',
            `
            top: ${top + height / 2}px;
            left: ${left + width - 4}px;
          `
          );
        });
    });

    resizeObserver.observe(document.querySelector('body'));
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
      if (request.type === 'getClickedEl') {
        this.createLoading();
        this.handleButtonClick({ input, label }, { target: null });

        sendResponse({
          msg: 'handleButtonClick started!',
        });
      }
    });
  }

  listenFormData() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('request', request);
      if (request.type === 'getFormData') {
        const { data } = request;
        this.createCollectDataQuestion(data);

        sendResponse({
          msg: 'listenFormData started!',
        });
      }
    });
  }

  createLoading() {
    const div = document.createElement('div');
    div.setAttribute('class', 'jaf-extension-loading');
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
    this.connectAndSyncWithStorage();
    this.render({ showIcon });
    this.resizeObserver();
  }
}

export default new Content();
