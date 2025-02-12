package yc.ma.LearnTogether.user.domain.model;

import org.springframework.data.relational.core.mapping.Table;

@Table(name = "profiles", schema = "youcoder")
public class Profile {

    private String bio;
    private String location;
    private String websiteLink;

    public Profile () {
    }

    public Profile ( String bio, String location, String websiteLink ) {
        this.bio = bio;
        this.location = location;
        this.websiteLink = websiteLink;
    }

    public String getBio () {
        return bio;
    }

    public void setBio ( String bio ) {
        this.bio = bio;
    }

    public String getLocation () {
        return location;
    }

    public void setLocation ( String location ) {
        this.location = location;
    }

    public String getWebsiteLink () {
        return websiteLink;
    }

    public void setWebsiteLink ( String websiteLink ) {
        this.websiteLink = websiteLink;
    }
}
