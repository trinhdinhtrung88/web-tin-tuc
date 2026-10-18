
// Lấy ID bài viết từ đường dẫn
const params = new URLSearchParams(
  window.location.search
);

const articleId = params.get("id");

// Lấy bài viết từ LocalStorage
async function loadArticle() {
  try {
    let posts = JSON.parse(
      localStorage.getItem("news_posts") || "[]"
    );

    // Nếu LocalStorage chưa có dữ liệu
    // thì đọc từ file JSON
    if (posts.length === 0) {
      const response = await fetch("data/posts.json");

      if (!response.ok) {
        throw new Error("Không thể tải bài viết");
      }

      posts = await response.json();
    }

    // Tìm bài viết theo ID
    const article = posts.find(
      post => String(post.id) === articleId
    );

    if (!article) {
      showError("Không tìm thấy bài viết!");
      return;
    }

    renderArticle(article);

  } catch (error) {
    console.error(error);
    showError("Có lỗi khi tải bài viết.");
  }
}

// Hiển thị thông tin bài viết
function renderArticle(article) {

  document.title =
    article.title + " - Tin Tức 24H";

  document.getElementById(
    "article-title"
  ).textContent = article.title;

  document.getElementById(
    "article-excerpt"
  ).textContent = article.excerpt || "";

  // Tác giả
  const author = typeof article.author === "object"
    ? article.author?.name || "Không rõ"
    : article.author || "Không rõ";

  document.getElementById(
    "article-author"
  ).textContent = "Tác giả: " + author;

  // Thời gian
  const date = new Date(article.publishedAt);

  document.getElementById(
    "article-date"
  ).textContent = Number.isNaN(date.getTime())
    ? "Chưa có thời gian"
    : date.toLocaleString("vi-VN");

  // Chuyên mục
  const category = Array.isArray(article.category)
    ? article.category.join(", ")
    : article.category || "Chưa phân loại";

  document.getElementById(
    "article-category"
  ).textContent = category;

  // Ảnh bài viết
  const imageContainer = document.getElementById(
    "article-image"
  );

  imageContainer.replaceChildren();

  if (article.image) {
    const image = document.createElement("img");

    image.src = article.image;
    image.alt = article.title;
    image.loading = "lazy";

    imageContainer.appendChild(image);
  }

  // Nội dung bài viết
  const contentContainer = document.getElementById(
    "article-content"
  );

  contentContainer.replaceChildren();

  const content = article.content || "";

  // Dùng textContent để tránh chèn HTML độc hại
  content.split(/\n+/).forEach(paragraph => {
    if (!paragraph.trim()) return;

    const p = document.createElement("p");
    p.textContent = paragraph.trim();

    contentContainer.appendChild(p);
  });

  // Nguồn bài viết
  const sourceContainer = document.getElementById(
    "article-source"
  );

  sourceContainer.replaceChildren();

  const sourceText = document.createElement("p");
  sourceText.textContent =
    "Nguồn: " + (article.source || "Không rõ");

  sourceContainer.appendChild(sourceText);

  if (article.url) {
    try {
      const url = new URL(article.url);

      if (
        url.protocol === "https:" ||
        url.protocol === "http:"
      ) {
        const link = document.createElement("a");
        link.href = url.href;
        link.textContent = "Xem bài viết gốc";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        sourceContainer.appendChild(link);
      }
    } catch {
      // Bỏ qua URL không hợp lệ
    }
  }
}

// Thông báo lỗi
function showError(message) {
  const container = document.getElementById(
    "article-detail"
  );

  container.replaceChildren();

  const heading = document.createElement("h2");
  heading.textContent = message;

  container.appendChild(heading);
}

loadArticle();
