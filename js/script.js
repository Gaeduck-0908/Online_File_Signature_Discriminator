document.addEventListener("DOMContentLoaded", function () {
    bsCustomFileInput.init();
  });
  
function checkFileSignature() {
    const fileInput = document.getElementById('customFile');
    const file = fileInput.files[0];
    if (!file) {
      alert('파일을 선택해주세요.');
      return;
    }
  
    fetch('json/signatures.json').then(response => response.json()).then(signatures => {
      const reader = new FileReader();
      reader.onload = function(e) {
        const fileContent = e.target.result;
        const hexContent = Array.from(new Uint8Array(fileContent)).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join('');
        let resultFound = false;
  
        for (let [ext, sig] of Object.entries(signatures)) {
          const headerMatch = hexContent.startsWith(sig.header.toUpperCase());
          const footerMatch = sig.footer ? hexContent.endsWith(sig.footer.toUpperCase()) : true;
          if (headerMatch && footerMatch) {
            document.getElementById('resultMessage').textContent = `파일 타입: ${ext}`;
            document.getElementById('resultMessage').style.display = 'block';
            resultFound = true;
            break;
          }
        }
  
        if (!resultFound) {
          document.getElementById('resultMessage').textContent = "알 수 없는 파일 타입";
          document.getElementById('resultMessage').style.display = 'block';
        }
  
        // 파일 내용을 라인별로 출력하는 부분
        const hexLines = getHexLines(Array.from(new Uint8Array(fileContent)));
        document.getElementById('fileContent').textContent = hexLines;
        document.getElementById('fileContent').style.display = 'block';
      };
      reader.readAsArrayBuffer(file);
    }).catch(error => console.error('Error loading signatures:', error));
  }
  
  function getHexLines(buffer) {
    let result = '';
    for (let i = 0; i < buffer.length; i += 16) {
      const slice = buffer.slice(i, i + 16);
      const hexArray = slice.map(byte => byte.toString(16).padStart(2, "0").toUpperCase());
      const hexStr = hexArray.join(" ");
      const asciiStr = slice.map(byte => byte > 31 && byte < 127 || byte > 159 ? String.fromCharCode(byte) : ".").join("");
      result += `${i.toString(16).padStart(6, "0").toUpperCase()}  ${hexStr.padEnd(47, " ")}  ${asciiStr}\n`;
    }
    return result.trim();
  }
  
function showResultMessage(content) {
    const resultMessage = document.getElementById('resultMessage');
    resultMessage.textContent = content; // 내용 설정
    resultMessage.style.display = 'block'; // 보여주기
}