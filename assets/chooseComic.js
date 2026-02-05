document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.getElementById("dropdown");
  const tagList = document.getElementById("tagList");
  const box = document.getElementById("box");
  const toggleBtn = document.getElementById("toggleTag");
  const tagArea = document.getElementById("tagArea");

  /* 並び替え */
  [
    { value: "default", text: "デフォルト" },
    { value: "name", text: "作品名順" },
    { value: "author", text: "作者名順" },
  ].forEach((o) => {
    const op = document.createElement("option");
    op.value = o.value;
    op.textContent = o.text;
    dropdown.appendChild(op);
  });

  /* チェックボックス生成 */
  tags.forEach((tag) => {
    const label = document.createElement("label");
    label.className = "tag-item";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = tag.value;

    const text = document.createTextNode(tag.text);

    label.appendChild(input);
    label.appendChild(text);
    tagList.appendChild(label);

    /* ← ここを変更 */
    input.addEventListener("change", () => {
      label.classList.toggle("checked", input.checked);
      updateFilter();
    });
  });

  let currentFilters = [];
  let currentSort = "default";

  /* カード生成 */
  function createCard([name, link, image, author]) {
    return `
  <a href="${link}" class="comic-card">
    <img src="${image}" class="comic-img">
    <div class="comic-title">
      <div>${name}</div>
      <div style="font-size:12px">${author}</div>
    </div>
  </a>
  `;
  }

  /* フィルタ更新 */
  function updateFilter() {
    currentFilters = Array.from(
      document.querySelectorAll(".tag-item input:checked"),
    ).map((i) => i.value);
    render();
  }

  /* 取得 */
  function getData() {
    let filtered = [...comics];

    if (currentFilters.length > 0) {
      filtered = filtered.filter((c) =>
        currentFilters.every((tag) => c[4].includes(tag)),
      );
    }

    if (currentSort === "name") {
      filtered.sort((a, b) => a[0].localeCompare(b[0], "ja"));
    } else if (currentSort === "author") {
      filtered.sort((a, b) => a[3].localeCompare(b[3], "ja"));
    }

    return filtered;
  }

  function render() {
    box.innerHTML = getData().map(createCard).join("");
  }

  /* 並び替え */
  dropdown.addEventListener("change", () => {
    currentSort = dropdown.value;
    render();
  });

  /* 開閉 */
  toggleBtn.addEventListener("click", () => {
    const open = tagArea.style.display === "block";
    tagArea.style.display = open ? "none" : "block";
    toggleBtn.textContent = open ? "タグ検索を開く" : "タグ検索を閉じる";
  });

  render();
});
