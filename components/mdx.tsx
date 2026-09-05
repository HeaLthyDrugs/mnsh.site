import { Wrench } from "@phosphor-icons/react/dist/ssr";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeExternalLinks from "rehype-external-links";
import type { LineElement } from "rehype-pretty-code";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UTM_PARAMS } from "@/config/site";
import { cn } from "@/lib/utils";
import type { NpmCommands } from "@/types/unist";



import { CodeBlockCommand } from "./code-block-command";
import { CopyButton } from "./copy-button";
import { getIconForLanguageExtension, Icons } from "./icons";
import { CodeCollapsibleWrapper } from "./code-collapsible-wrapper";
import { Code, Heading } from "./ui/typography";
import { CodeTabs } from "./code-tabs";
import { FramedImage, YouTubeEmbed } from "./embed";

const components: MDXRemoteProps["components"] = {
  h1: (props: React.ComponentProps<"h1">) => <Heading as="h1" {...props} />,
  h2: (props: React.ComponentProps<"h2">) => <Heading as="h2" {...props} />,
  h3: (props: React.ComponentProps<"h3">) => <Heading as="h3" {...props} />,
  h4: (props: React.ComponentProps<"h4">) => <Heading as="h4" {...props} />,
  h5: (props: React.ComponentProps<"h5">) => <Heading as="h5" {...props} />,
  h6: (props: React.ComponentProps<"h6">) => <Heading as="h6" {...props} />,
  table: Table,
  thead: TableHeader,
  tbody: TableBody,
  tr: TableRow,
  th: TableHead,
  td: TableCell,
  figure({ className, ...props }: React.ComponentProps<"figure">) {
    const hasPrettyCode = "data-rehype-pretty-code-figure" in props;

    return (
      <figure
        className={cn(hasPrettyCode && "not-prose", className)}
        {...props}
      />
    );
  },
  figcaption: ({ children, ...props }: React.ComponentProps<"figcaption">) => {
    const iconExtension =
      "data-language" in props && typeof props["data-language"] === "string"
        ? getIconForLanguageExtension(props["data-language"])
        : null;

    return (
      <figcaption {...props}>
        {iconExtension}
        {children}
      </figcaption>
    );
  },
  pre({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    __withMeta__,
    __rawString__,

    __pnpm__,
    __yarn__,
    __npm__,
    __bun__,

    ...props
  }: React.ComponentProps<"pre"> & {
    __withMeta__?: boolean;
    __rawString__?: string;
  } & NpmCommands) {
    const isNpmCommand = __pnpm__ && __yarn__ && __npm__ && __bun__;

    if (isNpmCommand) {
      return (
        <CodeBlockCommand
          __pnpm__={__pnpm__}
          __yarn__={__yarn__}
          __npm__={__npm__}
          __bun__={__bun__}
        />
      );
    }

    return (
      <>
        <pre {...props} />

        {typeof __rawString__ === "string" && __rawString__.length > 0 ? (
          <CopyButton
            className="absolute top-2 right-2"
            value={__rawString__}
          />
        ) : null}
      </>
    );
  },
  code: Code,

  CodeTabs,
  CodeCollapsibleWrapper,
  Steps: (props) => (
    <div
      className="md:ml-3.5 md:border-l md:pl-7.5 prose-h3:text-wrap"
      {...props}
    />
  ),
  Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3 className={cn("step", className)} {...props} />
  ),
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsListInstallType: () => (
    <TabsList>
      <TabsTrigger value="cli">
        <Icons.shadcn />
        shadcn CLI
      </TabsTrigger>

      <TabsTrigger value="manual">
        <Wrench />
        Manual
      </TabsTrigger>
    </TabsList>
  ),
  YouTubeEmbed,
  FramedImage,
  img: FramedImage,
};

const options: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm,],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { target: "_blank", rel: "nofollow noopener noreferrer", ...UTM_PARAMS },
      ],
      rehypeSlug,
      // Capture raw code text before rehype-pretty-code rewrites the tree
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "pre") {
            const [codeEl] = node.children;
            if (codeEl?.tagName !== "code") {
              return;
            }

            // Flatten text from code children (may be a single text node)
            const raw =
              codeEl.children
                ?.map((child: { type?: string; value?: string }) =>
                  child?.type === "text" ? (child.value ?? "") : ""
                )
                .join("") ?? "";

            node.__rawString__ = raw;
            // Also stash on properties so pretty-code can carry it onto the figure
            node.properties = node.properties ?? {};
            node.properties.__rawString__ = raw;
          }
        });
      },
      [
        rehypePrettyCode,
        {
          theme: {
            dark: "github-dark",
            light: "github-light",
          },
          keepBackground: false,
          onVisitLine(node: LineElement) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
        },
      ],
      // Move raw string onto the transformed <pre> so the MDX component can copy it
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "figure") {
            if (!("data-rehype-pretty-code-figure" in (node.properties ?? {}))) {
              return;
            }

            const preElement = node.children.at(-1);
            if (preElement?.tagName !== "pre") {
              return;
            }

            const raw =
              node.__rawString__ ??
              node.properties?.__rawString__ ??
              preElement.properties?.__rawString__;

            preElement.properties = preElement.properties ?? {};
            preElement.properties.__withMeta__ =
              node.children.at(0)?.tagName === "figcaption";
            if (typeof raw === "string" && raw.length > 0) {
              preElement.properties.__rawString__ = raw;
            }
          }
        });
      },

    ],
  },
};

export function MDX({ code }: { code: string }) {
  return <MDXRemote source={code} components={components} options={options} />;
}
