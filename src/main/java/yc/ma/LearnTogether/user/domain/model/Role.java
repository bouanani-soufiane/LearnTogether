package yc.ma.LearnTogether.user.domain.model;

import org.springframework.data.relational.core.mapping.Table;

@Table(name = "roles", schema = "youcoder")

public class Role {

    private String name;

    public Role () {
    }

    public Role ( String name ) {
        this.name = name;
    }

    // Getter and Setter

    public String getName () {
        return name;
    }

    public void setName ( String name ) {
        this.name = name;
    }
}
