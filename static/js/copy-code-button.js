function createCopyButton(highlightDiv) {
  const button = document.createElement("button");
  button.className = "copy-code-button";
  button.type = "button";
  button.innerText = "Copy~";
  button.addEventListener("click", () =>
    copyCodeToClipboard(button, highlightDiv)
  );
  addCopyButtonToDom(button, highlightDiv);
}

async function copyCodeToClipboard(button, highlightDiv) {
  // const codeToCopy = highlightDiv.querySelector(":last-child > .chroma > code >.line")
  //   .innerText;
  const codeToCopy = Array.from(highlightDiv.querySelectorAll(":last-child > .chroma > code > .line >.cl")) //嗷嗷解決了！！！
  .map(codeElement => codeElement.innerText)
  .join(" ");
  try {
    result = await navigator.permissions.query({ name: "clipboard-write" });
    if (result.state == "granted" || result.state == "prompt") {
      await navigator.clipboard.writeText(codeToCopy);
    } else {
      copyCodeBlockExecCommand(codeToCopy, highlightDiv);
    }
  } catch (_) {
    copyCodeBlockExecCommand(codeToCopy, highlightDiv);
  } finally {
    codeWasCopied(button);
  }
}

// async function copyCodeToClipboard(button, highlightDiv) {
//   const codeElements = highlightDiv.querySelectorAll(":last-child > .chroma > code.cl");
//   let codeToCopy = "";

//   codeElements.forEach(codeElement => {
//     codeToCopy += codeElement.innerText + "\n";
//   });

//   try {
//     result = await navigator.permissions.query({ name: "clipboard-write" });
//     if (result.state == "granted" || result.state == "prompt") {
//       await navigator.clipboard.writeText(codeToCopy);
//     } else {
//       copyCodeBlockExecCommand(codeToCopy, highlightDiv);
//     }
//   } catch (_) {
//     copyCodeBlockExecCommand(codeToCopy, highlightDiv);
//   } finally {
//     codeWasCopied(button);
//   }
// }

function copyCodeBlockExecCommand(codeToCopy, highlightDiv) {
  const textArea = document.createElement("textArea");
  textArea.contentEditable = "true";
  textArea.readOnly = "false";
  textArea.className = "copyable-text-area";
  textArea.value = codeToCopy;
  highlightDiv.insertBefore(textArea, highlightDiv.firstChild);
  const range = document.createRange();
  range.selectNodeContents(textArea);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  textArea.setSelectionRange(0, textArea.value.length);
  // document.execCommand("copy");
  highlightDiv.removeChild(textArea);
}

function codeWasCopied(button) {
  button.blur();
  button.innerText = "Copied!";
  setTimeout(function () {
    button.innerText = "Copy";
  }, 2000);
}

function addCopyButtonToDom(button, highlightDiv) {
  highlightDiv.insertBefore(button, highlightDiv.firstChild);
  const wrapper = document.createElement("div");
  wrapper.className = "highlight-wrapper";
  highlightDiv.parentNode.insertBefore(wrapper, highlightDiv);
  wrapper.appendChild(highlightDiv);
}

document
  .querySelectorAll(".highlight")
  .forEach((highlightDiv) => createCopyButton(highlightDiv));

