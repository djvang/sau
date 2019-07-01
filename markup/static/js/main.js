"use strict";

const API_URL = window.wp_api || `${window.location.origin}/wp-json/wp/v2`;

Vue.component("posts", {
    props: {
        type: {
            type: String,
            default: "post"
        },
        page: {
            type: Number,
            default: 1
        },
        limit: {
            type: Number,
            default: 10
        },
        filters: {
            type: Array,
            default: () => []
        },
        data: {}
    },
    data: function() {
        return {
            isFetching: false,
            posts: []
        };
    },
    methods: {
        next: function() {
            this.isFetching = true;

            let type = this.type === "post" ? "posts" : this.type;
            let url = new URL(`${API_URL}/${type}`);
            let filters = this.filters.reduce((filters, filter) => {
                let items = filter.split("=");
                filters[`filter${items[0]}`] = items[1];
                return filters;
            }, {});

            let params = {
                _embed: 1,
                page: this.page,
                per_page: this.limit,
                ...filters
            };
            url.search = new URLSearchParams(params);

            fetch(url)
                .then(response => response.json())
                .then(json => {
                    if (json.message) {
                        throw new Error(json.message);
                    }
                    this.posts.push(...json);
                    this.isFetching = false;
                    this.page += 1;
                })
                .catch(error => {
                    this.isFetching = false;
                    UIkit.notification({
                        message: error.message,
                        status: "danger",
                        pos: "top-right",
                        timeout: 3000
                    });
                });
        }
    },
    filters: {
        formatDate: function(value) {
            if (!value) return "";
            value = value.toString();
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric"
            };
            return new Date(value).toLocaleDateString("uk-UA", options);
        }
    }
});

const app = new Vue({
    el: "#app",
    delimiters: ["${", "}"]
    data: {
        research: {
            isFetching: false,
            page: 1,
            per_page: 5,
            data: []
        }
        // some data
    },
    methods: {
        getResearch: function() {
            this.research.isFetching = true;
            this.research.page += 1;

            let url = new URL(`${API_URL}/posts`);
            let params = {
                _embed: 1,
                page: this.research.page,
                per_page: this.research.per_page
            };
            url.search = new URLSearchParams(params);

            fetch(url)
                .then(response => response.json())
                .then(json => {
                    if (json.message) {
                        throw new Error(json.message);
                    }
                    this.research.data.push(...json);
                    this.research.isFetching = false;
                })
                .catch(error => {
                    this.research.isFetching = false;
                    console.log(error.message);
                    UIkit.notification({
                        message: error.message,
                        status: "danger",
                        pos: "top-right",
                        timeout: 3000
                    });
                });
        }
        // some get data
    },
    filters: {
        formatDate: function(value) {
            if (!value) return "";
            value = value.toString();
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric"
            };
            return new Date(value).toLocaleDateString("uk-UA", options);
        }
    }
});
