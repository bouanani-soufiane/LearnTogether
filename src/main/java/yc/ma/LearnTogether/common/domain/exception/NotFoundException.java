package yc.ma.LearnTogether.common.domain.exception;

public class NotFoundException extends RuntimeException {
    public <T> NotFoundException ( String entity, T id ) {
        super(entity + " with id " + id + " not found");
    }
}
