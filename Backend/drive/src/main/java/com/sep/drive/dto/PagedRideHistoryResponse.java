package com.sep.drive.dto;

import java.util.List;

public class PagedRideHistoryResponse {
    private List<RideHistoryEntry> entries;
    private int totalCount;

    public PagedRideHistoryResponse() {}

    public PagedRideHistoryResponse(List<RideHistoryEntry> entries, int totalCount) {
        this.entries = entries;
        this.totalCount = totalCount;
    }

    public List<RideHistoryEntry> getEntries() {
        return entries;
    }

    public void setEntries(List<RideHistoryEntry> entries) {
        this.entries = entries;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }
}
