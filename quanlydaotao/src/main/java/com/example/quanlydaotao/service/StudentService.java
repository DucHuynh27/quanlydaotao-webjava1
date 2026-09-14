package com.example.quanlydaotao.service;

import java.util.List;
import java.util.UUID;
import java.util.Comparator;

import org.springframework.stereotype.Service;

import com.example.quanlydaotao.entity.Student;
import com.example.quanlydaotao.repository.StudentRepository;

@Service
public class StudentService {
    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAll() {
        return studentRepository.findAll().stream().sorted(Comparator.comparingInt(this::extractNumber)).toList();
    }

    public List<Student> search(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return studentRepository.findAll().stream().sorted(Comparator.comparingInt(this::extractNumber)).toList();
        }
        String value = keyword.trim();
        return studentRepository
                .findByStudentCodeContainingIgnoreCaseOrFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCaseOrClassNameContainingIgnoreCase(
                        value, value, value, value, value)
                .stream().sorted(Comparator.comparingInt(this::extractNumber)).toList();
    }

    public Student getById(UUID id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên với id: " + id));
    }

    public Student save(Student student) {
        return studentRepository.save(student);
    }

    public void delete(UUID id) {
        studentRepository.deleteById(id);
    }

    // bỏ tiền tố SV
    private int extractNumber(Student student) {
        return Integer.parseInt(student.getStudentCode().replaceAll("[^0-9]", ""));
    }
}
