import stringSimilarity from 'string-similarity';
import StorageHelper from '../Popup/helpers/storage.helper';

let autoFillAction = false;
let autoFillIndex = 0;

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
    };

    this.isWebSiteDisabled = false;

    this.requests = {
      autofill: {
        index: 0,
        func: () => this.autoFill(),
      },
    };

    this.requestsProxy = new Proxy(this.requests, {
      set: (target, key, value) => {
        const obj = target;
        obj[key] = {
          ...obj[key],
          ...value,
        };

        obj[key].func();

        return true;
      },
    });
  }

  incrementRequestAutoFillIndex() {
    if (
      this.requestsProxy.autofill.index < this.inputs.length &&
      autoFillAction
    ) {
      this.requestsProxy.autofill = {
        index: this.requests.autofill.index + 1,
      };
    }
  }

  findPos(el) {
    let _x = 0;
    let _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: _y, left: _x };
  }

  getStorageData(key, arr) {
    if (arr) {
      let string = '';

      arr.forEach &&
        arr.forEach((item) => {
          const result = `Q: ${item.question} A: ${item.answer} `;
          string += result;
        });

      string = arr;

      this.data[key] = string;
    }
  }

  connectAndSyncWithStorage() {
    try {
      console.log('connectAndSyncWithStorage WORKS!');
      ['personal', 'business', 'incognito', 'targetDataSet'].forEach((key) => {
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

    if (input.parentNode.querySelector('.jaf-extension-button')) {
      const btns = input.parentNode.querySelectorAll('.jaf-extension-button');
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove('has-loading');
      }
    }
  }

  fillElements({ input, answer }) {
    const funcs = {
      TEXTAREA: () => (input.innerText = answer),
      INPUT: () => (input.value = answer),
    };

    funcs[input.nodeName] && funcs[input.nodeName]();

    this.removeLoadingStyleFromCurrentInput(input);

    if (document.querySelector('.jaf-extension-progress')) {
      autoFillIndex++;

      const filteredInputs = [...this.inputs].filter((item) => {
        if (
          item.nodeName === 'INPUT' &&
          ['file', 'tel', 'radio', 'checkbox', 'date'].includes(
            item.getAttribute('type')
          )
        )
          return false;

        return item;
      });

      if (autoFillIndex === filteredInputs.length) this.stopAutoFill();
    }
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
      StorageHelper.get({
        key: 'targetDataSet',
        callback: (targetDataSet) => {
          StorageHelper.get({
            key: targetDataSet || 'personal',
            callback: (data) => {
              if (buttonEl) buttonEl.classList.add('has-loading');

              if (
                input &&
                input.getAttribute &&
                input.getAttribute('class') &&
                input.getAttribute('class').indexOf &&
                input.getAttribute('class').indexOf('jaf-extension-focus') &&
                input.getAttribute('class').indexOf('jaf-extension-focus') <
                  0 &&
                !autoFillAction
              )
                input.classList.add('jaf-extension-focus');

              const promptData = data.reduce((payload, item) => {
                let string = payload;
                console.log('item', item);
                string += `Q: ${Object.keys(item)[0]} A: ${
                  item[Object.keys(item)[0]]
                }`;

                return string;
              }, '');

              let smilarScore = 0;
              let smilarKey = '';

              data.forEach((dataItem) => {
                const score = stringSimilarity.compareTwoStrings(
                  String(Object.keys(dataItem)[0]) || '',
                  label.innerText.split(' ').join('_').toLowerCase()
                );

                if (score > smilarScore) {
                  smilarScore = score;
                  smilarKey = Object.keys(dataItem)[0];
                }
              });

              if (smilarScore > 0.52) {
                const answer = data.filter(
                  (item) => Object.keys(item)[0] === smilarKey
                )[0][smilarKey];

                this.fillElements({ input, answer });
                this.incrementRequestAutoFillIndex();
                return;
              }

              console.log('promptData', promptData);

              chrome.runtime.sendMessage(
                { type: 'CATEGORIZE_DATA', query: label.innerText },
                (response) => {
                  const inputType = this.getInputType(response.data.data);
                  console.log('@INPUT_TYPE: ', inputType);

                  if (['personal', 'information'].includes(inputType)) {
                    chrome.runtime.sendMessage(
                      {
                        type: 'COMPLETION',
                        prompt: `${promptData} Q: ${label.innerText}?`,
                      },
                      (response) => {
                        // console.log('response', response);
                        const answer = response.data.data.choices[0].text;

                        this.fillElements({
                          input,
                          answer: answer.split('A:')[1] || '',
                        });
                        this.incrementRequestAutoFillIndex();
                      }
                    );
                  }

                  if (['idea', 'history'].includes(inputType)) {
                    chrome.runtime.sendMessage(
                      {
                        type: 'GENERATE_DATA',
                        context: `${promptData} Q: ${label.innerText}?`,
                      },
                      (response) => {
                        const textArr = response.data.data.data[0].text
                          .join('')
                          .split('A:');

                        const answer = textArr[textArr.length - 1] || '';
                        this.fillElements({ input, answer });
                        this.incrementRequestAutoFillIndex();
                      }
                    );
                  }
                }
              );
            },
          });
        },
      });
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

  findLabel(input) {
    window.scrollTo(0, 0);

    if (
      input.nodeName === 'INPUT' &&
      ['file', 'tel', 'radio', 'checkbox', 'date'].includes(
        input.getAttribute('type')
      )
    )
      return false;

    const { id: inputId } = input;

    let i = 0;
    let parentEl = input;
    let targetLabel;

    while (i < 10) {
      const el =
        parentEl.parentNode &&
        parentEl.parentNode.querySelector &&
        (parentEl.parentNode.querySelector('label') ||
          parentEl.parentNode.querySelector('div[role="heading"]'));

      if (el) {
        targetLabel = el;
        i = 10;
      }

      parentEl = parentEl.parentNode;
      i++;
    }

    const label =
      document.querySelector(`label[for="${inputId}"]`) || targetLabel;

    return label;
  }

  createExtensionLogo({ input, label }) {
    const button = document.createElement('button');
    const { width, height } = input.getBoundingClientRect();

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
    button.setAttribute(
      'style',
      `
        top: ${height / 2}px;
        left: ${width - 8}px;
      `
    );

    return button;
  }

  render({ showIcon }) {
    if (!showIcon) {
      this.removeAllButtons();
      return;
    }

    this.inputs.forEach((input) => {
      const label = this.findLabel(input);
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
    StorageHelper.save({ key: 'personal', data });

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
    try {
      for (let i = 0; i < this.inputs.length; i++) {
        const fillingLabel = document.getElementById('jaf-filling-label');
        const input = this.inputs[i];
        if (!input) return;

        const label = this.findLabel(this.inputs[i]);

        if (!label) continue;

        if (fillingLabel) fillingLabel.innerText = 'Filling';

        this.handleButtonClick({ input, label }, { target: null });
      }
    } catch (err) {
      console.error(err);
    }
  }

  stopAutoFill() {
    if (document.querySelector('.jaf-extension-progress')) {
      document.querySelector('.jaf-extension-progress').remove();
      autoFillIndex = 0;
      chrome.runtime.sendMessage({ type: 'AUTOFILL_FINISHED' }, (response) => {
        console.log(response);
      });
    }
  }

  createProgressSection() {
    const div = document.createElement('div');
    div.setAttribute('class', 'jaf-extension-progress');

    div.innerHTML = `
      <div class="jaf-extension-progress-message">
        <img src="https://www.jotform.com/wepay/assets/img/podo.png?v=1.0.0.0" alt="jotform-podo" />
        <h4>
          <span id="jaf-filling-label">Full name</span>
        </h4>
        <div class="jaf-extension-progress-bar-wrapper">
          <div class="jaf-extension-progress-bar"></div>
        </div>
        <!-- <button id="jaf-stop-filling" type="button">Stop</button> -->
      </div>
    `;

    // div.querySelector('button').addEventListener('click', this.stopAutoFill);

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
      console.log('request', request);
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
    const { height, width } = input.getBoundingClientRect();
    const { top, left } = this.findPos(input);
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

  resizeObserver() {
    const resizeObserver = new ResizeObserver(() => {
      document
        .querySelectorAll('.jaf-extension-loading')
        .forEach((item, index) => {
          const input1 = document.querySelector(
            `*#${item.getAttribute('input-id')}`
          );
          const input2 = document.querySelector(
            `*[name="${item.getAttribute('input-id')}"]`
          );
          const targetInput = input1 || input2;
          if (!targetInput) return;
          const { top, left } = this.findPos(targetInput);
          const { height, width } = targetInput.getBoundingClientRect();

          item.setAttribute(
            'style',
            `
              top: ${top + height / 2}px;
              left: ${left + width}px;
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
