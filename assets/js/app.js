
let allPosts = [];
let categories = [];

// Đọc dữ liệu JSON
async function loadData() {
  try {
    const [categoryRes, postRes] = await Promise.all([
      fetch("data/categories.json"),
      fetch("data/posts.json")
    ]);

    if (!categoryRes.ok || !postRes.ok) {
      throw new Error("Không tải được dữ liệu JSON");
    }

    const categoryData = await categoryRes.json();
    const samplePosts = await postRes.json();

    categories = categoryData.menu;

    localStorage.setItem(
      "news_categories",
      JSON.stringify(categories)
    );

    // Giữ lại bài viết được lưu từ crawler
    const saved = JSON.parse(
      localStorage.getItem("news_posts") || "[]"
    );

    const postMap = new Map();

    [...samplePosts, ...saved].forEach(post => {
      postMap.set(post.id, post);
    });

    allPosts = [...postMap.values()];

    localStorage.setItem(
      "news_posts",
      JSON.stringify(allPosts)
    );

    renderNavbar();
    renderPosts("latest");

  } catch (error) {
    console.error(error);
    document.getElementById("post-list").textContent =
      "Không thể tải dữ liệu bài viết.";
  }
}

// Hiển thị thanh chuyên mục
function renderNavbar() {
  const navbar = document.getElementById("navbar");
  navbar.innerHTML = "";

  categories.forEach(category => {
    const link = document.createElement("a");
    link.textContent = category.title;

    if (category.type === "external") {
      link.href = category.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.href = "#";
      link.addEventListener("click", event => {
        event.preventDefault();
        renderPosts(category.id);
      });
    }

    navbar.appendChild(link);
  });
}

// Tạo thẻ bài viết
function createPostCard(post, className) {
  const card = document.createElement("a");
  card.className = "post-card " + className;
  card.href = "article.html?id=" +
    encodeURIComponent(post.id);

  if (post.image) {
    const image = document.createElement("img");
    image.src = post.image;
    image.alt = post.title;
    image.loading = "lazy";
    card.appendChild(image);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "image-placeholder";
    placeholder.textContent = "TIN TỨC";
    card.appendChild(placeholder);
  }

  const body = document.createElement("div");
  body.className = "post-body";

  const title = document.createElement("h3");
  title.textContent = post.title;

  const excerpt = document.createElement("p");
  excerpt.textContent = post.excerpt;

  const time = document.createElement("small");
  time.textContent = new Date(
    post.publishedAt
  ).toLocaleString("vi-VN");

  body.append(title, excerpt, time);
  card.appendChild(body);

  return card;
}

// Lọc và hiển thị bài viết
function renderPosts(categoryId) {
  const featured = document.getElementById(
    "featured-posts"
  );

  const list = document.getElementById("post-list");
  const heading = document.getElementById(
    "category-title"
  );

  featured.innerHTML = "";
  list.innerHTML = "";

  const category = categories.find(
    item => item.id === categoryId
  );

  heading.textContent =
    categoryId === "latest" || categoryId === "home"
      ? "Tin mới nhất"
      : category?.title || "Tin tức";

  let posts = [...allPosts];

  if (categoryId !== "latest" && categoryId !== "home") {
    const selected = categories.find(
      item => item.id === categoryId
    );

    const ids = [
      categoryId,
      ...(selected?.children || []).map(c => c.id)
    ];

    posts = posts.filter(post => {
      const postCategories = Array.isArray(post.category)
        ? post.category
        : [post.category];

      return ids.some(id => postCategories.includes(id));
    });
  }

  posts.sort((a, b) =>
    new Date(b.publishedAt) - new Date(a.publishedAt)
  );

  if (posts.length === 0) {
    list.textContent = "Chưa có bài viết trong chuyên mục.";
    return;
  }

  // Ba bài viết nổi bật
  const topPosts = posts.slice(0, 3);

  featured.appendChild(
    createPostCard(topPosts[0], "featured-main")
  );

  if (topPosts.length > 1) {
    const side = document.createElement("div");
    side.className = "featured-side";

    topPosts.slice(1).forEach(post => {
      side.appendChild(
        createPostCard(post, "featured-small")
      );
    });

    featured.appendChild(side);
  }

  // Danh sách bài viết còn lại
  posts.slice(3).forEach(post => {
    list.appendChild(
      createPostCard(post, "list-item")
    );
  });
}

loadData();
