"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

// Simple basic markdown parser helper
function renderContent(content: string) {
  if (!content) return null;
  
  const lines = content.split('\n');
  return lines.map((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      return <h1 key={index} className="text-3xl font-extrabold mt-8 mb-4 text-foreground">{trimmed.slice(2)}</h1>;
    }
    if (trimmed.startsWith('## ')) {
      return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-foreground">{trimmed.slice(3)}</h2>;
    }
    if (trimmed.startsWith('### ')) {
      return <h3 key={index} className="text-xl font-bold mt-4 mb-2 text-foreground">{trimmed.slice(4)}</h3>;
    }
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      return <li key={index} className="ml-6 list-disc mb-1.5 text-muted-foreground">{trimmed.slice(2)}</li>;
    }
    if (trimmed.match(/^\d+\.\s/)) {
      return <li key={index} className="ml-6 list-decimal mb-1.5 text-muted-foreground">{trimmed.replace(/^\d+\.\s/, '')}</li>;
    }
    if (trimmed === '') {
      return <div key={index} className="h-4" />;
    }
    return <p key={index} className="leading-relaxed mb-4 text-muted-foreground text-base md:text-lg">{trimmed}</p>;
  });
}

export default function BlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    async function fetchPost() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single();
        if (!error && data) {
          setPost(data);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <p className="text-muted-foreground text-sm">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-background">
        <div className="bg-muted p-4 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Article Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          The article you are looking for does not exist or may have been moved.
        </p>
        <Button asChild>
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background pb-24">
      {/* Header / Cover */}
      <div className="relative w-full h-[40vh] md:h-[50vh] bg-zinc-900 flex items-center justify-center overflow-hidden">
        {post.featured_image_url ? (
          <>
            <img 
              src={post.featured_image_url} 
              alt={post.title} 
              className="absolute inset-0 w-full h-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
        )}
        
        <div className="absolute top-8 left-4 md:left-8 z-20">
          <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur border-none hover:bg-background gap-2" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-card border rounded-3xl p-6 md:p-10 shadow-xl space-y-6">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-muted-foreground border-b pb-6">
            <span className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold uppercase tracking-wider text-[10px]">
              <Tag className="w-3.5 h-3.5" />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.publish_date || (post.created_at ? new Date(post.created_at).toLocaleDateString() : '')}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              By {post.author}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed italic border-l-4 border-primary pl-4 py-1">
            {post.excerpt}
          </p>

          {/* Content */}
          <div className="prose prose-zinc dark:prose-invert max-w-none pt-4 border-t">
            {renderContent(post.content)}
          </div>
        </div>
      </div>
    </article>
  );
}
