console.log("Publish.js 已成功加载！");

function autoExpand() {
    const folders = document.querySelectorAll('.nav-folder.is-collapsed');
    if (folders.length > 0) {
        folders.forEach(f => f.classList.remove('is-collapsed'));
        console.log("已尝试展开文件夹，数量：", folders.length);
    }
}

// 持续探测 5 秒，确保内容加载完
let timer = setInterval(autoExpand, 500);
setTimeout(() => clearInterval(timer), 5000);