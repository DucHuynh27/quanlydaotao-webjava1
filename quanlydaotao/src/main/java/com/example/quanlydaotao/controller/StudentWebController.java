package com.example.quanlydaotao.controller;

import com.example.quanlydaotao.entity.Student;
import com.example.quanlydaotao.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Controller
@RequestMapping("/students")
public class StudentWebController {
    @Autowired
    private StudentService studentService;

    // 1. danh sách sinh viên + tìm kiếm
    @GetMapping
    public String listStudents(@RequestParam(required = false) String keyword, Model model) {
        model.addAttribute("students", studentService.search(keyword));
        model.addAttribute("keyword", keyword);
        return "students/list";
    }

    // 2. form thêm mới
    @GetMapping("/create")
    public String showCreateForm(Model model) {
        model.addAttribute("student", new Student());
        return "students/create";
    }

    // 3. xử lí thêm mới
    @PostMapping("/create")
    public String createStudent(@ModelAttribute("student") Student student) {
        studentService.save(student);
        return "redirect:/students";
    }

    // 4. form chỉnh sửa
    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable UUID id, Model model) {
        model.addAttribute("student", studentService.getById(id));
        return "students/edit";
    }

    // 5. xử lý cập nhật
    @PostMapping("/edit/{id}")
    public String updateStudent(@PathVariable UUID id, @ModelAttribute("student") Student student) {
        student.setId(id);
        studentService.save(student);
        return "redirect:/students";
    }

    // 6. xoá sinh viên
    @PostMapping("/delete/{id}")
    public String deleteStudent(@PathVariable UUID id) {
        studentService.delete(id);
        return "redirect:/students";
    }
}
