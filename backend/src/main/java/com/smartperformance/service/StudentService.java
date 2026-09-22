package com.smartperformance.service;

import com.smartperformance.dto.StudentRequest;
import com.smartperformance.dto.StudentResponse;
import com.smartperformance.entity.Student;
import com.smartperformance.exception.DuplicateResourceException;
import com.smartperformance.exception.ResourceNotFoundException;
import com.smartperformance.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {
    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    public StudentResponse create(StudentRequest request) {
        if (repository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("A student with this email already exists.");
        }
        Student s = new Student();
        s.setStudentName(request.getStudentName().trim());
        s.setEmail(request.getEmail().trim().toLowerCase());
        s.setCourse(request.getCourse().trim());
        s.setActive(1);
        return toResponse(repository.save(s));
    }

    public List<StudentResponse> getActiveStudents() {
        return repository.findByActiveOrderByStudentNameAsc(1)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public StudentResponse getById(Long id) {
        return toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + id)));
    }

    private StudentResponse toResponse(Student s) {
        return new StudentResponse(s.getStudentId(), s.getStudentName(), s.getEmail(), s.getCourse(), s.getActive());
    }
}
