package com.dmart.clone.service;

import com.dmart.clone.model.Order;
import com.dmart.clone.model.User;

public interface OrderService {

	Order placeOrder(User user);
}
