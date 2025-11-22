package com.sep.drive.userprofile;

public class MergeName {

    String fullname;

    public MergeName(String firstname, String lastname) {
        fullname = firstname + " " + lastname;
    }

    public String getFullName() {
        return fullname;
    }
}
