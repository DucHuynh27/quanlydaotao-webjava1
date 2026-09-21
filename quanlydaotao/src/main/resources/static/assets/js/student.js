document.addEventListener("DOMContentLoaded", () => {
    loadStudents();
});


async function loadStudents() {
    const response = await fetch("http://localhost:8080/api/students");
    const students = await response.json();
    renderStudents(students);
}


function renderStudents(students) {
    const tbody = document.getElementById("studentTableBody");
    tbody.innerHTML = "";

    students.forEach(student => {
        const row = `
            <tr>
                <td>${student.studentCode}</td>
                <td>${student.fullName}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td>${student.className}</td>
                <td class="text-end">
                    <div class="table-actions d-flex justify-content-end gap-1">
                        <!-- Xem -->
                        <a
                            class="btn btn-info btn-sm"
                            href="index.html?page=form&id=${encodeURIComponent(student.id)}&mode=view"
                            title="Xem"
                        >
                            <i class="bi bi-eye"></i>
                        </a>
                        <!-- Sửa -->
                        <a
                            class="btn btn-warning btn-sm"
                            href="index.html?page=form&id=${encodeURIComponent(student.id)}&mode=edit"
                            title="Sửa"
                        >
                            <i class="bi bi-pencil-square"></i>
                        </a>
                    </div>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}
