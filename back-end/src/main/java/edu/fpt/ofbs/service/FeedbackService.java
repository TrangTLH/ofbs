package edu.fpt.ofbs.service;

import java.util.List;

import edu.fpt.ofbs.entities.Feedback;
import edu.fpt.ofbs.models.FeedbackDTO;
import edu.fpt.ofbs.models.IFeedbackDTO;

public interface FeedbackService {

	List<IFeedbackDTO> getFeedbackByRestaurantId(long restaurantId, float rate);

	Feedback save(FeedbackDTO feedbackDto);

	List<Feedback> findByRateAndStatus();

	void updateStatusFeedback(long feedbackId);

}
