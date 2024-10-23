import { CodeTemplate, TsrpcConfig } from 'tsrpc-cli';

const tsrpcConf: TsrpcConfig = {
    // Generate ServiceProto
    proto: [
        {
            ptlDir: 'src/privateProtocols', // Protocol dir
            output: 'src/privateProtocols/serviceProto_private.ts', // Path for generated ServiceProto
            apiDir: 'src/apiPrivate',   // API dir
            docDir: 'docs/apiPrivate',     // API documents dir
            ptlTemplate: CodeTemplate.getExtendedPtl(),
        },
        {
            ptlDir: 'src/shared/protocols/public', // Protocol dir
            output: 'src/shared/protocols/serviceProto_public.ts', // Path for generated ServiceProto
            apiDir: 'src/apiPublic',   // API dir
            docDir: 'docs/apiPublic',     // API documents dir
            ptlTemplate: CodeTemplate.getExtendedPtl(),
        },
    ],
    // Sync shared code
    sync: [
        {
            from: 'src/shared',
            to: '../client/assets/module_basic/shared',
            type: 'symlink'     // Change this to 'copy' if your environment not support symlink
        }
    ],
    // Dev server
    dev: {
        autoProto: true,        // Auto regenerate proto
        autoSync: true,         // Auto sync when file changed
        autoApi: true,          // Auto create API when ServiceProto updated
        watch: 'src',           // Restart dev server when these files changed
        entry: 'src/index.ts',  // Dev server command: node -r ts-node/register {entry}
    },
    // Build config
    build: {
        autoProto: true,        // Auto generate proto before build
        autoSync: true,         // Auto sync before build
        autoApi: true,          // Auto generate API before build
        outDir: 'dist',         // Clean this dir before build
    }
}
export default tsrpcConf;