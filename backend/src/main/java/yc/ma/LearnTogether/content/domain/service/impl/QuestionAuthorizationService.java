package yc.ma.LearnTogether.content.domain.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import yc.ma.LearnTogether.common.infrastructure.security.SecurityUtils;
import yc.ma.LearnTogether.content.domain.repository.QuestionRepository;
import yc.ma.LearnTogether.user.infrastructure.userdetails.UserDetailsImpl;

@Service
@RequiredArgsConstructor
public class QuestionAuthorizationService {

    private final QuestionRepository questionRepository;
    private final SecurityUtils securityUtils;

    public boolean canEditQuestion ( Long questionId ) {
        Long currentUserId = securityUtils.getCurrentUserId();
        return questionRepository.findById(questionId)
                .map(question -> question.getUserId().equals(currentUserId))
                .orElse(false);
    }

    public boolean canDeleteQuestion ( Long questionId ) {
        Long currentUserId = securityUtils.getCurrentUserId();

        UserDetailsImpl currentUser = securityUtils.getCurrentUser();
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return true;
        }

        return questionRepository.findById(questionId)
                .map(question -> question.getUserId().equals(currentUserId))
                .orElse(false);


    }

    public boolean canMarkAnswerAsValid ( Long answerId ) {
        Long currentUserId = securityUtils.getCurrentUserId();

        return questionRepository.findByAnswersId(answerId)
                .map(question -> question.getUserId().equals(currentUserId))
                .orElse(false);
    }
}