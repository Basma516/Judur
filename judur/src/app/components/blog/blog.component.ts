import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { BlogService, BlogPost } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent], // Import standalone NavbarComponent and necessary modules
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  blogPosts: any[] = [];
  paginatedPosts: any[] = [];
  currentPage: number = 1;
  pageSize: number = 6; // Adjust as needed

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.blogService.getPosts().subscribe(
      (data) => {
        this.blogPosts = data;
        this.paginatePosts();
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  paginatePosts(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedPosts = this.blogPosts.slice(start, end);
  }

  nextPage(): void {
    this.currentPage++;
    this.paginatePosts();
  }

  previousPage(): void {
    this.currentPage--;
    this.paginatePosts();
  }
}
