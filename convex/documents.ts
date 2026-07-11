import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id} from "./_generated/dataModel";

// LOCAL PREVIEW BYPASS — no Clerk/JWT auth. Every request is treated as this
// single fake user so the app is usable without signing in. Revert before deploy.
const LOCAL_PREVIEW_USER_ID = "local-preview-user";

export const archive = mutation({
    args: {id: v.id("documents")},
    handler: async (ctx, args) => {
        const identity: { subject: string } | null = { subject: LOCAL_PREVIEW_USER_ID };

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("Document not found");
        }

        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorized");
        }

        const recursiveArchive = async (
            documentId: Id<"documents"> 
        ) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) =>(
                    q
                        .eq("userId", userId)
                        .eq("parentDocumentID", documentId)
                ))
                .collect()

            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: true,
                });

                await recursiveArchive(child._id);
            }
        }

        const document = await ctx.db.patch(args.id, {
            isArchived: true,
        });

        // Await so every nested descendant is archived and any error propagates.
        await recursiveArchive(args.id);

        return document;
    }
})
 
export const getSidebar = query({
    args:{
        parentDocument: v.optional(v.id("documents"))
    },
    handler: async (ctx, args) => {
        const identity: { subject: string } | null = { subject: LOCAL_PREVIEW_USER_ID };

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user_parent", (q) => 
                q
                    .eq("userId", userId)
                    .eq("parentDocumentID", args.parentDocument)
            )
            .filter((q) => q.eq(q.field("isArchived"), false)
            )
            .order("desc")
            .collect();

        return documents
    },
});

export const create = mutation ({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents")),
    },
    handler:async (ctx, args) => {
        const identity: { subject: string } | null = { subject: LOCAL_PREVIEW_USER_ID };

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const document = await ctx.db.insert("documents", {
            title: args.title,
            parentDocumentID: args.parentDocument,
            userId,
            isArchived: false,
            isPublished: false,
        });

        return document;
    }
})

export const getTrash = query({
    handler: async (ctx) => {
        const identity: { subject: string } | null = { subject: LOCAL_PREVIEW_USER_ID };

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user_parent", 
                (q) => q.eq("userId", userId)
            )
            .filter(
                (q) => q.eq(q.field("isArchived"), true)
            )
            .order("desc")
            .collect();

        return documents;
    }
});

export const restore = mutation({
    
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity: { subject: string } | null = { subject: LOCAL_PREVIEW_USER_ID };

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("Document not found");
        }

        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorized");
        }

        const recursiveRestore = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) =>
                q
                    .eq("userId", userId)
                    .eq("parentDocumentID", documentId
                ))
                .collect();
            
            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: false,
                });

                await recursiveRestore(child._id);
            }
        }

        const options: Partial<Doc<"documents">> = {
            isArchived: false,
        }

        if (existingDocument.parentDocumentID) {
            const parentDocument = await ctx.db.get(existingDocument.parentDocumentID);

            if (parentDocument?.isArchived) {
                options.parentDocumentID = undefined;
            }
        }

        await ctx.db.patch(args.id, options);

        // Await so every nested descendant is restored and errors propagate.
        await recursiveRestore(args.id);

        // Return the freshly-updated document, not the stale pre-update snapshot.
        const document = await ctx.db.get(args.id);

        return document;
    }
});

export const remove = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity: { subject: string } | null = { subject: LOCAL_PREVIEW_USER_ID };

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if( !existingDocument) {
            throw new Error("Document not found");
        }

        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorized");
        }

        // Recursively delete every descendant so no orphaned documents remain.
        const recursiveDelete = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) =>
                    q
                        .eq("userId", userId)
                        .eq("parentDocumentID", documentId)
                )
                .collect();

            for (const child of children) {
                await recursiveDelete(child._id);
                await ctx.db.delete(child._id);
            }
        };

        await recursiveDelete(args.id);
        await ctx.db.delete(args.id);

        return existingDocument;
    }
});

export const getSearch = query({
    handler: async (ctx) => {
        const identity: { subject: string } | null = { subject: LOCAL_PREVIEW_USER_ID };

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const documents = await ctx.db
           .query("documents")
           .withIndex("by_user", (q) =>
                q.eq("userId", userId)
            )
          .filter((q) => 
            q.eq(q.field("isArchived"),
            false))
          .order("desc")
          .collect(); 

         return documents;
    }
});

export const getById = query({
    args: { documentId: v.id("documents") },
    handler: async (ctx, args) => {
        const identity: { subject: string } | null = { subject: LOCAL_PREVIEW_USER_ID };
        
        const document = await ctx.db.get(args.documentId);

        if (!document) {
            throw new Error("Not found");
        }

        if (document.isPublished && !document.isArchived) {
            return document;
        }

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        if (document.userId !== userId) {
            throw new Error("Unauthorized");
        }

        return document;
    }
});

export const update = mutation({
    args: {
        id: v.id("documents"),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        content: v.optional(v.string()),
        title: v.optional(v.string()),
        isPublished: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const identity: { subject: string } | null = { subject: LOCAL_PREVIEW_USER_ID };

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const { id, ...rest} = args;

        const existingDocument = await ctx.db.get(id);

        if (!existingDocument) {
            throw new Error("Not found");
        }

        if (existingDocument.userId!== userId) {
            throw new Error("Unauthorized");
        }

        const document = await ctx.db.patch(id, {
            ...rest,
        });

        return document;
    },
});

export const removeIcon = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity: { subject: string } | null = { subject: LOCAL_PREVIEW_USER_ID };

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("Not found");
        }

        if (existingDocument.userId!== userId) {
            throw new Error("Unauthorized");
        }

        const document = await ctx.db.patch(args.id, {
            icon: undefined,
        });

        return document;
    }
});

export const removeCover = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity: { subject: string } | null = { subject: LOCAL_PREVIEW_USER_ID };

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("Not found");
        }

        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorized");
        }

        const document = await ctx.db.patch(args.id, {
            coverImage: undefined,
            // Clear the legacy field too so removal is definitive.
            converImage: undefined,
        });

        return document;
    }
});





