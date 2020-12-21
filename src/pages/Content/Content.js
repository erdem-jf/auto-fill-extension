import StorageHelper from '../Popup/helpers/storage.helper';

class Content {
  constructor() {
    this.textInputs = document.querySelectorAll('input:not([type="hidden"])');
    // this.contentEditableEls = document.querySelectorAll(
    //   'div[contenteditable="true"]'
    // );
    this.inputs = [...this.textInputs];

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.connectAndSyncWithStorage = this.connectAndSyncWithStorage.bind(this);

    this.categories = ['information', 'idea', 'personal', 'history'];
    this.data = {
      personal: '',
      collected: '',
    };
  }

  getStorageData(key, arr) {
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
      ['personal', 'collected'].forEach((key) => {
        StorageHelper.get({
          key,
          callback: this.getStorageData.bind(this, key),
        });
      });
    } catch (err) {
      console.error(err);
    }
  }

  async handleButtonClick({ input, label }, { target: buttonEl }) {
    console.log('innerText', label.innerText);
    buttonEl.disabled = true;
    buttonEl.classList.add('has-loading');

    const removeLoadingFromCurrentButton = () => {
      buttonEl.disabled = false;
      buttonEl.classList.remove('has-loading');

      if (label.getAttribute('role') === 'heading') {
        input.nextElementSibling.style.display = 'none';
      }
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
                input.setAttribute('value', answer.split('A:')[1]);
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
                input.setAttribute('value', answer);
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

  init({ showIcon }) {
    this.connectAndSyncWithStorage();
    this.render({ showIcon });
    this.resizeObserver();
  }
}

export default new Content();
