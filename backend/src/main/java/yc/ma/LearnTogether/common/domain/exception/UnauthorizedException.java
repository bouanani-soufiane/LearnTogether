package yc.ma.LearnTogether.common.domain.exception;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException ( String message ) {
        super(message);
    }
}
