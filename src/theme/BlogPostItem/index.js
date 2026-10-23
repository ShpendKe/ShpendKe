import React from "react";
import BlogPostItem from "@theme-original/BlogPostItem";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import Comments from "@site/src/components/Comments";
import CenteredImage from '@site/src/components/Image';
export default function BlogPostItemWrapper(props) {
    const { metadata, assets, isBlogPostPage } = useBlogPost();
    const { comments = true } = metadata.frontMatter;
    return (<>  
      <CenteredImage src={assets.image} caption=""/>
      <BlogPostItem {...props}/>
      {comments && isBlogPostPage && <Comments />}
    </>);
}
