package com.smartperformance.dto;

public class StudentResponse {
    private Long studentId;
    private String studentName;
    private String email;
    private String course;
    private Integer active;

    public StudentResponse() {}

    public StudentResponse(Long studentId, String studentName, String email, String course, Integer active) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.email = email;
        this.course = course;
        this.active = active;
    }

    public Long getStudentId() { return studentId; }
    public String getStudentName() { return studentName; }
    public String getEmail() { return email; }
    public String getCourse() { return course; }
    public Integer getActive() { return active; }
}
