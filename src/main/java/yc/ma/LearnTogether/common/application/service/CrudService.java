package yc.ma.LearnTogether.common.application.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CrudService<ID, CreateRequestDTO, UpdateRequestDTO, ResponseDTO>  {
    Page<ResponseDTO> findAll ( Pageable pageable );

    ResponseDTO findById ( ID id );

    ResponseDTO create ( CreateRequestDTO dto );

    ResponseDTO update ( ID id, UpdateRequestDTO dto );

    void delete ( ID id );
}
