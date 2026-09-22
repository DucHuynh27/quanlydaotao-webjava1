const API = "http://localhost:8080/api/students";

let searchTimer = null;

// ─── Khởi động ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    loadStudents();
});

// ─── Tìm kiếm (debounce 300ms) ───────────────────────────────
function onSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        const keyword = document.getElementById("searchInput").value.trim();
        loadStudents(keyword);
    }, 300);
}

// ─── GET /api/students ───────────────────────────────────────
async function loadStudents(keyword = "") {
    const url = keyword ? `${API}?keyword=${encodeURIComponent(keyword)}` : API;
    try {
        const res = await fetch(url);
        const students = await res.json();
        renderStudents(students);
    } catch (err) {
        showTableMessage("Không thể tải dữ liệu. Kiểm tra server.", "danger");
    }
}

function renderStudents(students) {
    const tbody = document.getElementById("studentTableBody");
    if (!students.length) {
        showTableMessage("Không có sinh viên nào.", "muted");
        return;
    }
    tbody.innerHTML = students.map(s => `
        <tr>
            <td>${s.studentCode}</td>
            <td>${s.fullName}</td>
            <td>${s.email}</td>
            <td>${s.phone}</td>
            <td>${s.className}</td>
            <td class="text-center">
                <div class="d-flex justify-content-center gap-1">
                    <button class="btn btn-info btn-sm" onclick="openView('${s.id}')" title="Xem">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="openModal('edit', '${s.id}')" title="Sửa">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteStudent('${s.id}', '${s.fullName}')" title="Xóa">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

function showTableMessage(msg, type) {
    document.getElementById("studentTableBody").innerHTML =
        `<tr><td colspan="6" class="text-center py-4 text-${type}">${msg}</td></tr>`;
}

// ─── Modal Thêm / Sửa ────────────────────────────────────────
function openModal(mode, id = null) {
    document.getElementById("studentId").value = "";
    document.getElementById("studentCode").value = "";
    document.getElementById("fullName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("className").value = "";

    if (mode === "create") {
        document.getElementById("modalTitle").textContent = "Thêm sinh viên";
        new bootstrap.Modal(document.getElementById("studentModal")).show();
    } else {
        document.getElementById("modalTitle").textContent = "Chỉnh sửa sinh viên";
        fetchAndFillForm(id);
    }
}

// GET /api/students/{id} → fill form
async function fetchAndFillForm(id) {
    const res = await fetch(`${API}/${id}`);
    const s = await res.json();
    document.getElementById("studentId").value = s.id;
    document.getElementById("studentCode").value = s.studentCode;
    document.getElementById("fullName").value = s.fullName;
    document.getElementById("email").value = s.email;
    document.getElementById("phone").value = s.phone;
    document.getElementById("className").value = s.className;
    new bootstrap.Modal(document.getElementById("studentModal")).show();
}

// POST hoặc PUT
async function saveStudent() {
    const id = document.getElementById("studentId").value;
    const body = {
        studentCode: document.getElementById("studentCode").value.trim(),
        fullName:    document.getElementById("fullName").value.trim(),
        email:       document.getElementById("email").value.trim(),
        phone:       document.getElementById("phone").value.trim(),
        className:   document.getElementById("className").value.trim(),
    };

    if (!body.studentCode || !body.fullName) {
        alert("Mã sinh viên và Họ tên không được để trống!");
        return;
    }

    const isEdit = !!id;
    const url    = isEdit ? `${API}/${id}` : API;
    const method = isEdit ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        bootstrap.Modal.getInstance(document.getElementById("studentModal")).hide();
        loadStudents(document.getElementById("searchInput").value.trim());
    } catch {
        alert("Lưu thất bại. Kiểm tra lại dữ liệu hoặc server.");
    }
}

// ─── Modal Xem chi tiết ──────────────────────────────────────
async function openView(id) {
    const res = await fetch(`${API}/${id}`);
    const s = await res.json();
    document.getElementById("view-code").textContent  = s.studentCode;
    document.getElementById("view-name").textContent  = s.fullName;
    document.getElementById("view-email").textContent = s.email;
    document.getElementById("view-phone").textContent = s.phone;
    document.getElementById("view-class").textContent = s.className;
    new bootstrap.Modal(document.getElementById("viewModal")).show();
}

// ─── DELETE /api/students/{id} ───────────────────────────────
async function deleteStudent(id, name) {
    if (!confirm(`Xóa sinh viên "${name}"?`)) return;
    try {
        const res = await fetch(`${API}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        loadStudents(document.getElementById("searchInput").value.trim());
    } catch {
        alert("Xóa thất bại. Kiểm tra server.");
    }
}
