package yc.ma.LearnTogether.media.domain.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Component
public class CloudinaryService {

    private static final Dotenv dotenv = Dotenv.load();

    private static final String CLOUD_NAME = dotenv.get("CLOUD_NAME");
    private static final String API_KEY = dotenv.get("API_KEY");
    private static final String API_SECRET = dotenv.get("API_SECRET");

    private Cloudinary cloudinary;

    public CloudinaryService () {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap("cloud_name", CLOUD_NAME, "api_key", API_KEY, "api_secret", API_SECRET));
    }

    public Map<String, Object> uploadImage ( MultipartFile file ) throws Exception {
        return cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
    }

    public Map<String, Object> deleteImage ( String publicId ) throws Exception {
        return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

    }
}
