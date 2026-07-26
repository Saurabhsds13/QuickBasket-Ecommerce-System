package com.dmart.clone.service;

import java.util.List;

import com.dmart.clone.dto.ReturnRequestCreateDto;
import com.dmart.clone.dto.ReturnRequestDto;
import com.dmart.clone.model.User;

public interface ReturnRequestService {

    ReturnRequestDto createReturnRequest(User user, ReturnRequestCreateDto dto);

    List<ReturnRequestDto> getMyReturnRequests(User user);

    ReturnRequestDto getReturnRequestByOrderId(User user, Long orderId);
}
