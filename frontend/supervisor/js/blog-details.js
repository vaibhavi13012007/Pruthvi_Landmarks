fetch(`http://localhost:5000/api/blogs/${id}`)
  .then(res => res.json())
  .then(blog => {
    document.getElementById("views").innerText = blog.views;
    document.getElementById("likes").innerText = blog.likes;
    document.getElementById("comments").innerText = blog.comments.length;
  });
