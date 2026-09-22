/*package com.smartperformance.repository;

import com.smartperformance.entity.StudentPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PerformanceRepository extends JpaRepository<StudentPerformance, Long> {

    @Query("select p from StudentPerformance p join fetch p.student s where s.active = 1 order by p.createdAt desc")
    List<StudentPerformance> findActivePerformance();

    @Query("select avg(p.overallScore) from StudentPerformance p where p.overallScore is not null")
    Double findAverageScore();

    long countByPerformanceLevel(String level);
    long countByRiskStatus(String status);
}
*/
package com.smartperformance.repository;

import com.smartperformance.entity.StudentPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PerformanceRepository extends JpaRepository<StudentPerformance, Long> {

    @Query("""
        select p
        from StudentPerformance p
        join fetch p.student s
        where s.active = 1
        order by p.createdAt desc
    """)
    List<StudentPerformance> findActivePerformance();


    @Query("""
    select avg(p.overallScore)
    from StudentPerformance p
    where p.overallScore is not null
    and p.performanceId in (
        select max(p2.performanceId)
        from StudentPerformance p2
        group by p2.student.studentId
    )
""")
Double findAverageScore();

    @Query("""
        select count(p)
        from StudentPerformance p
        where p.performanceLevel = :level
        and p.performanceId in (
            select max(p2.performanceId)
            from StudentPerformance p2
            group by p2.student.studentId
        )
    """)
    long countLatestByPerformanceLevel(@Param("level") String level);


    @Query("""
        select count(p)
        from StudentPerformance p
        where p.riskStatus = :status
        and p.performanceId in (
            select max(p2.performanceId)
            from StudentPerformance p2
            group by p2.student.studentId
        )
    """)
    long countLatestByRiskStatus(@Param("status") String status);
}