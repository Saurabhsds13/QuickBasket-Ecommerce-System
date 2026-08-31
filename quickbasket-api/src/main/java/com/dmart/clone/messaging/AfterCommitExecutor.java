package com.dmart.clone.messaging;

import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

/**
 * Runs a callback after the current transaction commits. If there is no active
 * transaction, the callback runs immediately. Used so Kafka publishes only
 * happen once the corresponding DB state is durably committed (produce-after-commit).
 */
@Component
public class AfterCommitExecutor {

	public void execute(Runnable action) {
		if (TransactionSynchronizationManager.isSynchronizationActive()) {
			TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
				@Override
				public void afterCommit() {
					action.run();
				}
			});
		} else {
			action.run();
		}
	}
}
