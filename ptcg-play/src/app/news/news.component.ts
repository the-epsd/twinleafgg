import { Component, OnInit } from '@angular/core';

interface NewsPost {
  id: number;
  title: string;
  author: string;
  date: Date;
  content: string;
  image?: string;
  preview?: string;
}

@Component({
  selector: 'ptcg-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  public featuredPost: NewsPost | null = null;
  public regularPosts: NewsPost[] = [];
  public selectedPost: NewsPost | null = null;

  ngOnInit(): void {
    this.loadNews();
  }

  selectPost(post: NewsPost) {
    this.selectedPost = post;
  }

  private loadNews() {
    // Mock data for news posts
    const posts: NewsPost[] = [
      {
        id: 1,
        title: 'Welcome to Twinleaf',
        author: 'Joe',
        date: new Date('2024-12-26'),
        content: `Hello everyone!
        
It's so great to finally have Twinleaf available to the public. It's been a long year and a half of development, but I'm grateful to have had help from Eric and Tommy over the past several months. I hope you all enjoy what we've made, and if you have any suggestions or questions, bug reports or anything else, please don't hestitate to check out our Discord server!

We will use this News section to not only post feature updates, but also changelogs with bug fixes.

If you want to connect personally, you can find me on X @The_EPSD. Thank you all and I can't wait to hear feedback from everyone!
        
Joe`,
        image: 'https://pbs.twimg.com/media/F0C__sdXoAEMKtn?format=jpg',
        preview: `We're excited to finally have you all here!`,
      },
      {
        id: 2,
        title: 'Twinleaf Update - December 26th',
        author: 'Joe',
        date: new Date('2024-12-27'),
        content: `Twinleaf Update - December 26th
      
Engine:
- Added News Section

Cards:
- Fixed an issue where Morpeko PAR's Energizer Wheel could attach to multiple targets
- Fixed card text issues with Judge FST, Explorer's Guidance TEF
- Fixed prompt description issues with Nest Ball SVI
- Fixed incorrect set code numbers with Piers CPA, Sonia CPA, Mallow GRI
- Added Toedscool PAR 16  `,
        image: 'https://pbs.twimg.com/media/F0C__sdXoAEMKtn?format=jpg&name=large',
        preview: 'Update #2024.12.26'
      },
    ];

    posts.sort((a, b) => b.date.getTime() - a.date.getTime());

    this.featuredPost = posts[0];
    this.regularPosts = posts.slice(1);
  }

  getAuthorInitial(author: string | undefined): string {
    if (!author) {
      return '';
    }
    if (author === 'Joe') {
      return 'J';
    }
    if (author === 'Tommy') {
      return 'T';
    }
    return author;
  }
}