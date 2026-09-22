package com.smartperformance.auth.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="USERS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
        generator = "user_seq_generator"
    )
    @SequenceGenerator(
        name="user_seq_generator",
        sequenceName = "user_seq",
        allocationSize = 1
    )
    @Column(name="USER_ID")
    private Long userId;

    @Column(name="FULL_NAME")
    private String fullName;

    @Column(name="EMAIL",unique = true)
    private String email;

    @Column(name="PASSWORD_HASH")
    private String passwordHash;

    @Column(name="CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name="UPDATED_AT")
    private LocalDateTime updatedAt;

    @Column(name="IS_ACTIVE")
    private Integer isActive;
}
