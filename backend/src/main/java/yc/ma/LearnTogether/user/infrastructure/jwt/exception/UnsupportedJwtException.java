package yc.ma.LearnTogether.user.infrastructure.jwt.exception;

public class UnsupportedJwtException extends RuntimeException {
    public UnsupportedJwtException ( String message ) {
        super(message);
    }
}
