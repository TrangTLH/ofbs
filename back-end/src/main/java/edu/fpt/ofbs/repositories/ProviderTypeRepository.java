package edu.fpt.ofbs.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.fpt.ofbs.entities.ProviderType;

@Repository
public interface ProviderTypeRepository extends JpaRepository<ProviderType, Long>{

}
