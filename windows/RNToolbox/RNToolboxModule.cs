using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Toolbox.RNToolbox
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNToolboxModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNToolboxModule"/>.
        /// </summary>
        internal RNToolboxModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNToolbox";
            }
        }
    }
}
