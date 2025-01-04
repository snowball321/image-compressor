document.addEventListener("DOMContentLoaded", function () {
  const uploadArea = document.getElementById("uploadArea");
  const imageInput = document.getElementById("imageInput");
  const previewContainer = document.getElementById("previewContainer");
  const originalImage = document.getElementById("originalImage");
  const compressedImage = document.getElementById("compressedImage");
  const originalSize = document.getElementById("originalSize");
  const compressedSize = document.getElementById("compressedSize");
  const qualitySlider = document.getElementById("qualitySlider");
  const qualityValue = document.getElementById("qualityValue");
  const downloadBtn = document.getElementById("downloadBtn");

  let originalFile = null;

  // 点击上传区域触发文件选择
  uploadArea.addEventListener("click", () => {
    imageInput.click();
  });

  // 处理拖拽上传
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = "#007AFF";
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.style.borderColor = "#DEDEDE";
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = "#DEDEDE";
    const file = e.dataTransfer.files[0];
    if (file && file.type.match("image.*")) {
      handleImageUpload(file);
    }
  });

  // 处理文件选择
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  });

  // 处理图片上传
  function handleImageUpload(file) {
    originalFile = file;
    originalSize.textContent = formatFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      originalImage.src = e.target.result;
      compressImage(e.target.result, qualitySlider.value / 100);
    };
    reader.readAsDataURL(file);
    previewContainer.style.display = "block";
  }

  // 压缩图片
  function compressImage(dataUrl, quality) {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      compressedImage.src = compressedDataUrl;

      // 计算压缩后的大小
      const compressedSize = Math.round(
        ((compressedDataUrl.length - "data:image/jpeg;base64,".length) * 3) / 4
      );
      document.getElementById("compressedSize").textContent =
        formatFileSize(compressedSize);
    };
    img.src = dataUrl;
  }

  // 质量滑块变化时重新压缩
  qualitySlider.addEventListener("input", (e) => {
    qualityValue.textContent = e.target.value + "%";
    if (originalImage.src) {
      compressImage(originalImage.src, e.target.value / 100);
    }
  });

  // 下载压缩后的图片
  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "compressed_" + originalFile.name;
    link.href = compressedImage.src;
    link.click();
  });

  // 格式化文件大小
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
});
