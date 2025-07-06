document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const msg = await res.text();
      document.getElementById("message").innerHTML = msg;
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const res = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const msg = await res.text();
      document.getElementById("message").innerHTML = msg;
    });
  }
});
window.addEventListener("DOMContentLoaded", async () => {
    const table = document.getElementById("productTable");

    try {
        const res = await fetch("/admin/api/products");
        const data = await res.json();

        table.innerHTML = data.map(p => `
            <tr>
                <td>${p.name}</td>
                <td>${p.price?.toLocaleString() || 0}</td>
                <td>${p.quantity}</td>
                <td>${p.category}</td>
                <td style="color:${p.quantity <= 5 ? 'red' : 'green'}">
                    ${p.quantity <= 5 ? 'Low' : 'In stock'}
                </td>
            </tr>
        `).join("");
    } catch (err) {
        console.error('Lỗi khi load dữ liệu:', err);
        table.innerHTML = `<tr><td colspan="5">Không thể tải sản phẩm</td></tr>`;
    }
});
