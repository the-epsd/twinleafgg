import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

interface NewsPost {
  id: string;
  title: string;
  preview: string;
  content: string;
  date: Date;
  author: string;
  featured?: boolean;
  image?: string;
}

@Component({
  selector: 'ptcg-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  isAdmin = false;
  username = 'TheEPSD'; // Replace with actual user service/auth logic
  selectedPost: NewsPost | null = null;
  posts: NewsPost[] = [
    {
      id: '1',
      title: 'News 1',
      preview: 'Article Preview Text',
      content: 'Full Article Text',
      date: new Date('2024-12-04'),
      author: 'TheEPSD',
      featured: true,
    },
    {
      id: '2',
      title: 'News 2',
      preview: 'Article Preview Text',
      content: 'Full Article Text',
      date: new Date('2024-12-04'),
      author: 'TheEPSD',
    },
    {
      id: '3',
      title: 'News 3',
      preview: 'Article Preview Text',
      content: 'Full Article Text',
      date: new Date('2024-12-04'),
      author: 'TheEPSD',
    },
  ];

  get featuredPost() {
    return this.posts.find(post => post.featured);
  }

  get regularPosts() {
    return this.posts.filter(post => !post.featured);
  }

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.isAdmin = this.username === 'TheEPSD';
  }

  selectPost(post: NewsPost): void {
    this.selectedPost = this.selectedPost?.id === post.id ? null : post;
  }
}