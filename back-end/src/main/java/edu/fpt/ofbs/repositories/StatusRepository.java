package edu.fpt.ofbs.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.fpt.ofbs.entities.Status;

@Repository
public interface StatusRepository extends JpaRepository<Status, Long>{

	Status findByName(String name);

}
