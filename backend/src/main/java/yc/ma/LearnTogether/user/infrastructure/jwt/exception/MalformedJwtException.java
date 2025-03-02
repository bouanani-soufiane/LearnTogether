package yc.ma.LearnTogether.user.infrastructure.jwt.exception;

public class MalformedJwtException extends RuntimeException {
    public MalformedJwtException ( String message ) {
        super(message);
    }
}
